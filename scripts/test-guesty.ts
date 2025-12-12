/**
 * Test script to verify Guesty API integration and fetch listing IDs
 * Run with: npx tsx scripts/test-guesty.ts
 */

import { getValidToken } from '../lib/guesty/token-manager';
import { guestyFetch } from '../lib/guesty/client';
import type { GuestySearchApiResponse } from '../lib/guesty/types';

async function testGuestyIntegration() {
  console.log('🔐 Testing Guesty OAuth token retrieval...\n');

  try {
    // Step 1: Get OAuth token
    const token = await getValidToken();
    console.log('✅ Successfully retrieved OAuth token');
    console.log(`   Token (first 20 chars): ${token.substring(0, 20)}...\n`);

    // Step 2: Fetch all listings (no filters)
    console.log('🏠 Fetching all available listings...\n');

    const searchResponse = await guestyFetch<GuestySearchApiResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({
        checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        checkOut: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(), // 33 days from now
        guests: 2,
        ignoreCalendar: true, // Ignore calendar to see all listings
        ignoreTerms: true,
        ignoreBlocks: true,
      }),
    });

    console.log('✅ Successfully fetched listings\n');
    console.log('📋 Listing Details:\n');

    if (searchResponse.listings && searchResponse.listings.length > 0) {
      searchResponse.listings.forEach((listing, index) => {
        console.log(`${index + 1}. ${listing.title || listing.nickname || 'Unnamed'}`);
        console.log(`   ID: ${listing._id}`);
        console.log(`   Address: ${listing.address?.full || 'N/A'}`);
        console.log(`   Accommodates: ${listing.accommodates || 'N/A'} guests`);
        console.log(`   Bedrooms: ${listing.bedrooms || 'N/A'}`);
        console.log(`   Beds: ${listing.beds || 'N/A'}`);
        console.log('');
      });

      console.log('\n📝 Next Steps:');
      console.log('1. Match these listings to your cabins in data/cabins.json');
      console.log('2. Add the Guesty listing IDs to each cabin object');
      console.log('3. Update types/cabins.ts to include guestyListingId field\n');
    } else {
      console.log('⚠️  No listings found. This might be because:');
      console.log('   - Your Guesty account has no active listings');
      console.log('   - The credentials are for a test/staging environment');
      console.log('   - There are configuration issues in your Guesty account\n');
    }

    console.log('✅ Guesty integration test completed successfully!');
  } catch (error) {
    console.error('❌ Error testing Guesty integration:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testGuestyIntegration();
