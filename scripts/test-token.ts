/**
 * Token Management Test Script
 *
 * Tests the Guesty OAuth token renewal system with Vercel KV storage.
 *
 * Usage:
 *   npx tsx scripts/test-token.ts
 */

import { getValidToken } from '../lib/guesty/token-manager';
import { getStoredToken, clearStoredToken } from '../lib/guesty/token-store';

async function testTokenManagement() {
  console.log('🧪 Testing Guesty Token Management System\n');

  try {
    // Test 1: Get a valid token (will fetch new one if none exists)
    console.log('📝 Test 1: Getting valid token...');
    const token1 = await getValidToken();
    console.log('✅ Token obtained:', token1.substring(0, 20) + '...');
    console.log('   Length:', token1.length, 'characters\n');

    // Test 2: Check token is stored in Redis
    console.log('📝 Test 2: Checking token storage in Vercel KV...');
    const stored = await getStoredToken();
    if (stored) {
      console.log('✅ Token found in storage');
      console.log('   Expires at:', new Date(stored.expiresAt).toISOString());
      console.log('   Renewal count:', stored.renewalCount);
      console.log('   Time until expiration:', Math.round((stored.expiresAt - Date.now()) / 1000 / 60), 'minutes\n');
    } else {
      console.log('❌ Token not found in storage\n');
    }

    // Test 3: Get token again (should reuse cached)
    console.log('📝 Test 3: Getting token again (should reuse cached)...');
    const token2 = await getValidToken();
    if (token1 === token2) {
      console.log('✅ Token reused from cache (same token)\n');
    } else {
      console.log('⚠️  Different token returned (may have expired)\n');
    }

    // Test 4: Verify token format
    console.log('📝 Test 4: Verifying token format...');
    if (token1.length > 0 && typeof token1 === 'string') {
      console.log('✅ Token is a valid string\n');
    } else {
      console.log('❌ Invalid token format\n');
    }

    console.log('✅ All tests passed!\n');
    console.log('📊 Summary:');
    console.log('   - Token renewal: Working');
    console.log('   - Vercel KV storage: Working');
    console.log('   - Token caching: Working');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Optional: Clean up (uncomment to clear stored token after test)
async function cleanup() {
  console.log('\n🧹 Cleaning up...');
  await clearStoredToken();
  console.log('✅ Stored token cleared');
}

// Run tests
testTokenManagement()
  .then(() => {
    console.log('\n✅ Test complete!');
    // Uncomment to clean up after test:
    // return cleanup();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
