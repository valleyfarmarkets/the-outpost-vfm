import 'server-only';
import { NextResponse } from 'next/server';
import { guestyFetch } from '@/lib/guesty/client';

/**
 * Test endpoint to fetch all Guesty listings
 * GET /api/test/listings
 *
 * ⚠️ DEVELOPMENT ONLY - Remove before production deployment
 */
export async function GET() {
  try {
    console.log('[Test] Fetching all Guesty listings...');

    // Fetch all listings using Booking Engine API
    const listingsResponse = await guestyFetch<{
      results?: Array<{
        _id: string;
        title?: string;
        nickname?: string;
        address?: { full?: string };
        accommodates?: number;
        bedrooms?: number;
        beds?: number;
        bathrooms?: number;
      }>;
    }>('/api/listings', {
      method: 'GET',
    });

    const listings = listingsResponse.results?.map((listing) => ({
      id: listing._id,
      title: listing.title || listing.nickname || 'Unnamed',
      address: listing.address?.full || 'N/A',
      accommodates: listing.accommodates || 'N/A',
      bedrooms: listing.bedrooms || 'N/A',
      beds: listing.beds || 'N/A',
      bathrooms: listing.bathrooms || 'N/A',
    })) || [];

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
      message: 'Match these listing IDs to your cabins in data/cabins.json',
    });
  } catch (error) {
    console.error('[Test] Error fetching listings:', error);

    // Log full error details for debugging
    if (error && typeof error === 'object') {
      console.error('[Test] Error details:', JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error && typeof error === 'object' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
