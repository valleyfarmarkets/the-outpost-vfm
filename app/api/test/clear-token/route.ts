import 'server-only';
import { NextResponse } from 'next/server';
import { clearStoredToken } from '@/lib/guesty/token-store';

/**
 * Test endpoint to clear cached OAuth token
 * GET /api/test/clear-token
 *
 * ⚠️ DEVELOPMENT ONLY - Remove before production
 */
export async function GET() {
  try {
    await clearStoredToken();
    console.log('[Test] Cleared cached OAuth token from Redis');

    return NextResponse.json({
      success: true,
      message: 'Token cache cleared. Next API call will fetch a fresh token.',
    });
  } catch (error) {
    console.error('[Test] Error clearing token:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
