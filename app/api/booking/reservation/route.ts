import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guestyFetch, GuestyApiError } from '@/lib/guesty/client';
import type {
  GuestyReservationApiResponse,
  ReservationResponse,
} from '@/lib/guesty/types';

/**
 * POST /api/booking/reservation
 *
 * Creates a reservation from a quote with payment
 *
 * Request Body:
 * - quoteId: string (from /api/booking/quote)
 * - guest: { firstName, lastName, email, phone }
 * - paymentToken: string (Stripe token ID - REQUIRED for instant booking)
 * - notes: string (optional special requests)
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
  guest: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
  }),
  paymentToken: z.string().min(1, 'Payment token is required'),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validated = reservationSchema.parse(body);

    // 🚨 CRITICAL: Validate payment token exists
    // Guesty account requires payment for instant booking
    if (!validated.paymentToken) {
      return NextResponse.json(
        {
          error: 'Payment Required',
          message: 'Payment information is required to complete the booking.',
        },
        { status: 400 }
      );
    }

    // Call Guesty reservations API
    const guestyResponse = await guestyFetch<GuestyReservationApiResponse>('/reservations-v3/quote', {
      method: 'POST',
      body: JSON.stringify({
        quoteId: validated.quoteId,
        guest: {
          firstName: validated.guest.firstName,
          lastName: validated.guest.lastName,
          email: validated.guest.email,
          phone: validated.guest.phone,
        },
        // Payment token - Guesty will validate with Stripe
        // Note: Guesty may expect different formats:
        // - Stripe Token ID: tok_1AB2CD3EF4GH5IJ6
        // - Payment Method ID: pm_1AB2CD3EF4GH5IJ6
        // Test both during implementation to confirm which format Guesty accepts
        paymentToken: validated.paymentToken,
        ...(validated.notes && { notes: validated.notes }),
      }),
    });

    // Transform Guesty response to our API format
    const response: ReservationResponse = {
      reservationId:
        guestyResponse._id ??
        guestyResponse.reservationId ??
        'unknown-reservation',
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
        id: guestyResponse.listing?._id || guestyResponse.listingId || 'unknown-listing',
        name: guestyResponse.listing?.title || 'Cabin',
      },
      dates: {
        checkIn:
          guestyResponse.checkIn ||
          guestyResponse.checkInDateLocalized ||
          'unknown-date',
        checkOut:
          guestyResponse.checkOut ||
          guestyResponse.checkOutDateLocalized ||
          'unknown-date',
      },
      pricing: {
        basePrice: guestyResponse.money?.hostPayout || 0,
        cleaningFee: guestyResponse.money?.cleaningFee || 0,
        taxAmount: guestyResponse.money?.hostServiceFee || 0,
        total: guestyResponse.money?.totalPrice || 0,
        currency: guestyResponse.money?.currency || 'USD',
        nightlyRates: guestyResponse.nightlyRates || [],
      },
      paymentStatus: guestyResponse.paymentStatus === 'paid' ? 'paid' : 'pending',
    };

    // Log successful reservation (for monitoring)
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

    // Handle Guesty API errors
    if (error instanceof GuestyApiError) {
      console.error('[Reservation API] Guesty error:', error);

      // Handle specific error cases
      if (error.statusCode === 400) {
        // Check for common errors
        const errorMessage = error.errorData.message?.toLowerCase() || '';

        if (errorMessage.includes('quote') && errorMessage.includes('expired')) {
          return NextResponse.json(
            {
              error: 'Quote Expired',
              message: 'Your quote has expired. Please generate a new quote and try again.',
            },
            { status: 400 }
          );
        }

        if (errorMessage.includes('payment') || errorMessage.includes('declined')) {
          return NextResponse.json(
            {
              error: 'Payment Failed',
              message: 'Your payment could not be processed. Please check your payment details and try again.',
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

      // Generic error response
      return NextResponse.json(
        {
          error: 'Booking Service Error',
          message: 'Failed to create reservation. Please try again later.',
        },
        { status: error.statusCode >= 500 ? 503 : 400 }
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
