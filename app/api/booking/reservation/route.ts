import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guestyFetch, GuestyApiError } from '@/lib/guesty/client';
import type {
  GuestyReservationApiResponse,
  ReservationResponse,
} from '@/lib/guesty/types';
import {
  createPendingBooking,
  updateBookingWithConfirmation,
  markBookingFailed,
} from '@/lib/supabase/bookings-repository';
import { sendBookingConfirmation } from '@/lib/resend/email-client';
import { differenceInDays } from 'date-fns';
import { headers } from 'next/headers';

/**
 * POST /api/booking/reservation
 *
 * Creates a reservation from a quote with payment using PENDING STATE PATTERN
 *
 * Flow:
 * 1. Create PENDING booking in DB (single source of truth)
 * 2. Call Guesty API to process payment
 * 3. Parallel execution: Update DB + Send email (non-blocking)
 * 4. Return success (Guesty is source of truth for payment)
 *
 * Request Body:
 * - quoteId: string (from /api/booking/quote)
 * - guestyListingId: string (Guesty listing ID, NOT internal slug)
 * - cabinId: string (internal slug for reference)
 * - cabinName: string
 * - guests: { adults, children }
 * - checkIn: string (ISO date)
 * - checkOut: string (ISO date)
 * - estimatedTotal: number (for pending record)
 * - guest: { firstName, lastName, email, phone, notes }
 * - paymentToken: string (Stripe token ID)
 *
 * Response:
 * - reservationId: string
 * - confirmationCode: string
 * - status: 'confirmed' | 'pending'
 * - guest: GuestDetails
 * - listing: { id, name }
 * - dates: { checkIn, checkOut }
 * - pricing: PricingBreakdown
 * - paymentStatus: 'paid' | 'pending' | 'failed'
 */

const reservationSchema = z.object({
  quoteId: z.string().min(1, 'Quote ID is required'),
  guestyListingId: z.string().min(1, 'Guesty listing ID is required'),
  cabinId: z.string().min(1, 'Cabin ID is required'),
  cabinName: z.string().min(1, 'Cabin name is required'),
  guests: z.object({
    adults: z.number().int().min(1),
    children: z.number().int().min(0),
  }),
  checkIn: z.string(),
  checkOut: z.string(),
  estimatedTotal: z.number(),
  guest: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    notes: z.string().optional(),
  }),
  paymentToken: z.string().min(1, 'Payment token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validated = reservationSchema.parse(body);

    // Get request metadata
    const headersList = await headers();
    const ipAddress =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // STEP 1: Create PENDING booking in database FIRST
    // This ensures we have a record of every booking attempt
    let bookingRecord;
    try {
      bookingRecord = await createPendingBooking({
        guestDetails: validated.guest,
        quoteId: validated.quoteId,
        guestyListingId: validated.guestyListingId, // Use Guesty listing ID for API calls
        cabinId: validated.cabinId, // Store internal slug for reference
        cabinName: validated.cabinName,
        checkIn: validated.checkIn,
        checkOut: validated.checkOut,
        nights: differenceInDays(
          new Date(validated.checkOut),
          new Date(validated.checkIn)
        ),
        adults: validated.guests.adults,
        children: validated.guests.children,
        estimatedTotal: validated.estimatedTotal,
        stripeToken: validated.paymentToken,
        ipAddress,
        userAgent,
      });
      console.log(`[Reservation] Created pending booking ${bookingRecord.id}`);
    } catch (dbError) {
      console.error('[Reservation] Failed to create pending booking:', dbError);
      return NextResponse.json(
        {
          error: 'Database Error',
          message: 'Database unavailable. Please try again.',
        },
        { status: 500 }
      );
    }

    // STEP 2: Call Guesty to process payment and create reservation
    let guestyResponse: GuestyReservationApiResponse;
    try {
      guestyResponse = await guestyFetch<GuestyReservationApiResponse>(
        '/reservations-v3/quote',
        {
          method: 'POST',
          body: JSON.stringify({
            quoteId: validated.quoteId,
            guest: {
              firstName: validated.guest.firstName,
              lastName: validated.guest.lastName,
              email: validated.guest.email,
              phone: validated.guest.phone,
            },
            paymentToken: validated.paymentToken,
            ...(validated.guest.notes && { notes: validated.guest.notes }),
          }),
        }
      );
      console.log(
        `[Reservation] Guesty confirmed: ${guestyResponse.confirmationCode || 'pending'}`
      );
    } catch (guestyError) {
      console.error('[Reservation] Guesty call failed:', guestyError);

      // Mark booking as failed in database
      await markBookingFailed(
        bookingRecord.id,
        guestyError instanceof GuestyApiError
          ? guestyError.errorData.message || 'Payment failed'
          : 'Payment failed'
      );

      // Handle Guesty API errors
      if (guestyError instanceof GuestyApiError) {
        if (guestyError.statusCode === 400) {
          const errorMessage = guestyError.errorData.message?.toLowerCase() || '';

          if (errorMessage.includes('quote') && errorMessage.includes('expired')) {
            return NextResponse.json(
              {
                error: 'Quote Expired',
                message: 'Your quote has expired. Please generate a new quote and try again.',
              },
              { status: 400 }
            );
          }

          if (
            errorMessage.includes('payment') ||
            errorMessage.includes('declined')
          ) {
            return NextResponse.json(
              {
                error: 'Payment Failed',
                message:
                  'Your payment could not be processed. Please check your payment details and try again.',
              },
              { status: 400 }
            );
          }

          if (errorMessage.includes('available')) {
            return NextResponse.json(
              {
                error: 'Unavailable',
                message: 'These dates are no longer available. Please select different dates.',
              },
              { status: 400 }
            );
          }
        }

        return NextResponse.json(
          {
            error: 'Booking Service Error',
            message: 'Failed to create reservation. Please try again later.',
          },
          { status: guestyError.statusCode >= 500 ? 503 : 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Unexpected Error',
          message: 'An unexpected error occurred. Please try again.',
        },
        { status: 500 }
      );
    }

    // Transform Guesty response to our API format
    const response: ReservationResponse = {
      reservationId:
        guestyResponse._id ?? guestyResponse.reservationId ?? 'unknown-reservation',
      confirmationCode:
        guestyResponse.confirmationCode ??
        guestyResponse.confirmationId ??
        'pending-confirmation',
      status: guestyResponse.status === 'confirmed' ? 'confirmed' : 'pending',
      guest: {
        firstName: validated.guest.firstName,
        lastName: validated.guest.lastName,
        email: validated.guest.email,
        phone: validated.guest.phone,
      },
      listing: {
        id:
          guestyResponse.listing?._id ||
          guestyResponse.listingId ||
          'unknown-listing',
        name: guestyResponse.listing?.title || validated.cabinName,
      },
      dates: {
        checkIn:
          guestyResponse.checkIn ||
          guestyResponse.checkInDateLocalized ||
          validated.checkIn,
        checkOut:
          guestyResponse.checkOut ||
          guestyResponse.checkOutDateLocalized ||
          validated.checkOut,
      },
      pricing: {
        basePrice: guestyResponse.money?.hostPayout || 0,
        cleaningFee: guestyResponse.money?.cleaningFee || 0,
        taxAmount: guestyResponse.money?.hostServiceFee || 0,
        total: guestyResponse.money?.totalPrice || validated.estimatedTotal,
        currency: guestyResponse.money?.currency || 'USD',
        nightlyRates: guestyResponse.nightlyRates || [],
      },
      paymentStatus: guestyResponse.paymentStatus === 'paid' ? 'paid' : 'pending',
    };

    // STEP 3: Parallel execution for non-critical operations
    // Use Promise.allSettled to run email and DB update in parallel
    // These failures should NOT block the successful Guesty reservation
    const sideEffects = await Promise.allSettled([
      // Update database with confirmed details
      updateBookingWithConfirmation(bookingRecord.id, response),

      // Send confirmation email
      sendBookingConfirmation({
        guestName: `${validated.guest.firstName} ${validated.guest.lastName}`,
        guestEmail: validated.guest.email,
        cabinName: response.listing.name,
        confirmationCode: response.confirmationCode,
        checkIn: response.dates.checkIn,
        checkOut: response.dates.checkOut,
        totalPrice: response.pricing.total,
        currency: response.pricing.currency,
        nights: differenceInDays(
          new Date(response.dates.checkOut),
          new Date(response.dates.checkIn)
        ),
        guests: validated.guests.adults + validated.guests.children,
        cleaningFee: response.pricing.cleaningFee,
        guestNotes: validated.guest.notes || null,
      }),
    ]);

    // Log failures but don't block response
    sideEffects.forEach((result, index) => {
      if (result.status === 'rejected') {
        const operation = index === 0 ? 'DB update' : 'Email send';
        console.error(`[Reservation] ${operation} failed:`, result.reason);
      }
    });

    // STEP 4: Return success to user (Guesty confirmed, so booking is valid)
    console.log(
      `[Reservation API] Booking created: ${response.confirmationCode} for ${validated.guest.email}`
    );

    return NextResponse.json(response);
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    console.error('[Reservation API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred. Please contact support.',
      },
      { status: 500 }
    );
  }
}
