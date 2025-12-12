import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guestyFetch, GuestyApiError } from '@/lib/guesty/client';
import type { GuestySearchApiResponse, SearchResponse } from '@/lib/guesty/types';

/**
 * POST /api/booking/search
 *
 * Searches for availability of a specific listing for given dates
 *
 * Request Body:
 * - listingId: Guesty listing ID
 * - checkIn: ISO 8601 date-time string
 * - checkOut: ISO 8601 date-time string
 * - guests: { adults: number; children?: number }
 *
 * Response:
 * - available: boolean
 * - blockedDates: string[] (ISO dates)
 * - minimumStay: number (nights)
 * - maximumStay: number (nights)
 */

const searchSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  checkIn: z.string().datetime('Invalid check-in date format'),
  checkOut: z.string().datetime('Invalid check-out date format'),
  guests: z.object({
    adults: z.number().int().min(1, 'At least 1 adult required').max(20),
    children: z.number().int().min(0).max(10).optional().default(0),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validated = searchSchema.parse(body);

    // Calculate total guests
    const totalGuests = validated.guests.adults + validated.guests.children;

    // Call Guesty search API
    const guestyResponse = await guestyFetch<GuestySearchApiResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({
        checkIn: validated.checkIn,
        checkOut: validated.checkOut,
        listings: [validated.listingId],
        guests: totalGuests,
        // CRITICAL: These must be false to respect calendar/blocks
        ignoreCalendar: false,
        ignoreTerms: false,
        ignoreBlocks: false,
      }),
    });

    // Transform Guesty response to our API format
    // Note: Guesty's response structure may vary - adjust based on actual response
    const isAvailable = guestyResponse.results?.[0]?.available ?? false;
    const blockedDates = guestyResponse.results?.[0]?.blockedDates ?? [];
    const minimumStay = guestyResponse.results?.[0]?.minNights ?? 2;
    const maximumStay = guestyResponse.results?.[0]?.maxNights ?? 365;

    const response: SearchResponse = {
      available: isAvailable,
      listing: {
        id: validated.listingId,
        name: guestyResponse.results?.[0]?.title || 'Cabin',
        capacity: guestyResponse.results?.[0]?.accommodates || totalGuests,
      },
      blockedDates,
      minimumStay,
      maximumStay,
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
      console.error('[Search API] Guesty error:', error);
      return NextResponse.json(
        {
          error: 'Booking Service Error',
          message: 'Failed to check availability. Please try again later.',
        },
        { status: error.statusCode >= 500 ? 503 : 400 }
      );
    }

    // Handle unexpected errors
    console.error('[Search API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
