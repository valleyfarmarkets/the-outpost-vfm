import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guestyFetch, GuestyApiError } from '@/lib/guesty/client';
import type { GuestyQuoteApiResponse, QuoteResponse } from '@/lib/guesty/types';

/**
 * POST /api/booking/quote
 *
 * Generates a pricing quote for a specific listing and dates
 *
 * Request Body:
 * - listingId: Guesty listing ID
 * - checkIn: ISO 8601 date-time string
 * - checkOut: ISO 8601 date-time string
 * - guests: { adults: number; children?: number }
 * - ratePlanId: (optional) Specific rate plan to use
 *
 * Response:
 * - quoteId: string (used for creating reservation)
 * - expiresAt: ISO 8601 date-time
 * - pricing: { basePrice, cleaningFee, taxAmount, total, currency, nightlyRates }
 * - ratePlan: { id, name, cancellationPolicy }
 * - terms: string
 */

const quoteSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  checkIn: z.string().datetime('Invalid check-in date format'),
  checkOut: z.string().datetime('Invalid check-out date format'),
  guests: z.object({
    adults: z.number().int().min(1, 'At least 1 adult required').max(20),
    children: z.number().int().min(0).max(10).optional().default(0),
  }),
  ratePlanId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validated = quoteSchema.parse(body);

    // Calculate total guests
    const totalGuests = validated.guests.adults + validated.guests.children;

    // Call Guesty quotes API
    const guestyResponse = await guestyFetch<GuestyQuoteApiResponse>('/quotes', {
      method: 'POST',
      body: JSON.stringify({
        checkIn: validated.checkIn,
        checkOut: validated.checkOut,
        listingId: validated.listingId,
        numberOfGuests: totalGuests,
        ...(validated.ratePlanId && { ratePlanId: validated.ratePlanId }),
      }),
    });

    // Transform Guesty response to our API format
    // Note: Guesty's response structure may vary - adjust based on actual response
    const response: QuoteResponse = {
      quoteId: guestyResponse.quoteId ?? guestyResponse._id ?? 'unknown-quote',
      expiresAt:
        guestyResponse.expiresAt ??
        guestyResponse.validUntil ??
        new Date().toISOString(),
      checkIn: validated.checkIn,
      checkOut: validated.checkOut,
      numberOfGuests: totalGuests,
      pricing: {
        basePrice: guestyResponse.money?.hostPayout || 0,
        cleaningFee: guestyResponse.money?.cleaningFee || 0,
        taxAmount: guestyResponse.money?.hostServiceFee || 0,
        total: guestyResponse.money?.totalPrice || 0,
        currency: guestyResponse.money?.currency || 'USD',
        nightlyRates: guestyResponse.nightlyRates || [],
      },
      ratePlan: {
        id: guestyResponse.ratePlan?._id || 'default',
        name: guestyResponse.ratePlan?.title || 'Standard Rate',
        cancellationPolicy:
          guestyResponse.ratePlan?.cancellationPolicy || 'Flexible',
      },
      terms: guestyResponse.terms || 'Standard booking terms apply.',
    };

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
      console.error('[Quote API] Guesty error:', error);

      // Check for availability errors
      if (error.statusCode === 400 && error.errorData.message?.includes('available')) {
        return NextResponse.json(
          {
            error: 'Unavailable',
            message: 'These dates are no longer available. Please select different dates.',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Booking Service Error',
          message: 'Failed to generate quote. Please try again later.',
        },
        { status: error.statusCode >= 500 ? 503 : 400 }
      );
    }

    // Handle unexpected errors
    console.error('[Quote API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
