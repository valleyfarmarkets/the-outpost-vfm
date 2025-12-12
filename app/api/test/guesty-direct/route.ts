import 'server-only';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

/**
 * Direct Guesty test endpoint (bypasses Redis)
 * Tests credentials and fetches listings without token caching
 *
 * GET /api/test/guesty-direct
 *
 * ⚠️ DEVELOPMENT ONLY - Remove before production
 */
export async function GET() {
  try {
    console.log('[Test Direct] Step 1: Getting OAuth token from Guesty...');

    // Step 1: Get OAuth token directly
    const tokenResponse = await fetch(env.guesty.oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'booking_engine:api',
        client_id: env.guesty.clientId,
        client_secret: env.guesty.clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return NextResponse.json(
        {
          success: false,
          step: 'oauth',
          error: `Token request failed (${tokenResponse.status}): ${errorText}`,
        },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('[Test Direct] ✅ Token retrieved successfully');
    console.log(`[Test Direct] Token (first 20 chars): ${accessToken.substring(0, 20)}...`);

    // Step 2: Fetch listings
    console.log('[Test Direct] Step 2: Fetching listings from Guesty...');

    const searchResponse = await fetch(`${env.guesty.apiBaseUrl}/search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        checkOut: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
        guests: 2,
        ignoreCalendar: true,
        ignoreTerms: true,
        ignoreBlocks: true,
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      return NextResponse.json(
        {
          success: false,
          step: 'search',
          error: `Search request failed (${searchResponse.status}): ${errorText}`,
        },
        { status: 500 }
      );
    }

    const searchData = await searchResponse.json();

    console.log('[Test Direct] ✅ Listings retrieved successfully');

    const listings = searchData.listings?.map((listing: any) => ({
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
      tokenRetrieved: true,
      count: listings.length,
      listings,
      message: 'Guesty credentials verified! Match these listing IDs to data/cabins.json',
    });
  } catch (error) {
    console.error('[Test Direct] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
