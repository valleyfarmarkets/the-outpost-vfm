/**
 * Token Management Test API Route
 *
 * Tests the Guesty OAuth token renewal system.
 *
 * Usage:
 *   curl http://localhost:3000/api/test/token
 */

import { NextResponse } from 'next/server';
import { getValidToken } from '@/lib/guesty/token-manager';
import { getStoredToken } from '@/lib/guesty/token-store';

export async function GET() {
  try {
    console.log('🧪 Testing Guesty Token Management...');

    // Test 1: Get valid token
    const startTime = Date.now();
    const token = await getValidToken();
    const fetchTime = Date.now() - startTime;

    // Test 2: Check storage
    const stored = await getStoredToken();

    // Test 3: Get token again (should be cached)
    const startTime2 = Date.now();
    const token2 = await getValidToken();
    const fetchTime2 = Date.now() - startTime2;

    return NextResponse.json({
      success: true,
      tests: {
        tokenFetch: {
          passed: token.length > 0,
          tokenLength: token.length,
          tokenPreview: token.substring(0, 20) + '...',
          fetchTime: `${fetchTime}ms`,
        },
        storage: {
          passed: !!stored,
          expiresAt: stored?.expiresAt ? new Date(stored.expiresAt).toISOString() : null,
          renewalCount: stored?.renewalCount,
          minutesUntilExpiration: stored
            ? Math.round((stored.expiresAt - Date.now()) / 1000 / 60)
            : null,
        },
        caching: {
          passed: token === token2,
          cachedToken: token === token2 ? 'yes' : 'no',
          fetchTime: `${fetchTime2}ms`,
          speedup: fetchTime > 0 ? `${Math.round(fetchTime / fetchTime2)}x faster` : 'N/A',
        },
      },
      message: 'Token management system working correctly',
    });
  } catch (error: unknown) {
    console.error('❌ Token test failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
