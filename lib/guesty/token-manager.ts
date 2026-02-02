import 'server-only';
import {
  getStoredToken,
  setStoredToken,
  getRedisValue,
  setRedisValue,
  deleteRedisValue,
} from './token-store';
import type { OAuthTokenResponse } from './types';

/**
 * Guesty OAuth Token Manager with Race Condition Protection
 *
 * This module manages OAuth token lifecycle with:
 * - Redis-based persistence (survives serverless cold starts)
 * - Race condition lock (prevents simultaneous renewals)
 * - Renewal quota tracking (max 3 per 24 hours)
 */

const RENEWAL_LOCK_KEY = 'guesty:token:renewing';
const TOKEN_BUFFER_MS = 60000; // 1 minute buffer before expiration

/**
 * Gets a valid OAuth token, renewing if necessary
 *
 * CRITICAL: Implements lock mechanism to prevent race conditions
 * If multiple serverless instances hit expired token simultaneously,
 * only ONE will renew while others wait and reuse the fresh token.
 *
 * @returns Valid OAuth access token
 * @throws Error if renewal fails or quota exceeded
 */
export async function getValidToken(): Promise<string> {
  const cached = await getStoredToken();
  const now = Date.now();

  // Check if token exists and is not expired (with 1min buffer)
  if (cached && cached.expiresAt > now + TOKEN_BUFFER_MS) {
    return cached.accessToken;
  }

  // Check if renewal is already in progress (Lock)
  // If Redis fails, proceed without lock (acceptable for degraded mode)
  let isRenewing: string | null = null;
  try {
    isRenewing = await getRedisValue(RENEWAL_LOCK_KEY);
  } catch {
    console.warn('[Token Manager] Redis unavailable, proceeding without lock check');
  }

  if (isRenewing) {
    // Another instance is renewing. Wait 500ms and retry (polling)
    console.log('[Token Manager] Renewal in progress, waiting...');
    await sleep(500);
    return getValidToken(); // Recursive retry
  }

  // Check renewal limit (max 3 per 24 hours)
  if (cached) {
    const timeSinceReset = now - cached.renewalResetTime;

    if (cached.renewalCount >= 3 && timeSinceReset < 86400000) {
      throw new Error(
        'Token renewal limit exceeded (3/24hrs). Please try again later or contact support.'
      );
    }

    // Reset counter if 24 hours passed
    if (timeSinceReset >= 86400000) {
      cached.renewalCount = 0;
      cached.renewalResetTime = now;
    }
  }

  // Set Lock (expire in 10s to prevent deadlocks)
  // If Redis fails, proceed without lock (may cause duplicate renewals, but that's acceptable)
  try {
    await setRedisValue(RENEWAL_LOCK_KEY, 'true', 10);
  } catch {
    console.warn('[Token Manager] Redis unavailable, proceeding without lock');
  }

  try {
    console.log('[Token Manager] Renewing token...');

    // Renew token
    const newToken = await renewToken();

    // Save to Redis (non-critical - token works even if not cached)
    try {
      await setStoredToken({
        accessToken: newToken.access_token,
        expiresAt: now + newToken.expires_in * 1000,
        renewalCount: (cached?.renewalCount || 0) + 1,
        renewalResetTime: cached?.renewalResetTime || now,
      });
      console.log('[Token Manager] Token renewed and cached successfully');
    } catch {
      console.warn('[Token Manager] Token renewed but caching failed (Redis unavailable)');
    }

    return newToken.access_token;
  } finally {
    // Release Lock (even if renewal fails)
    try {
      await deleteRedisValue(RENEWAL_LOCK_KEY);
    } catch {
      // Ignore - lock will expire anyway
    }
  }
}

/**
 * Renews the Guesty OAuth token via OAuth2 client credentials flow
 *
 * @returns OAuthTokenResponse containing new access token
 * @throws Error if renewal request fails
 */
async function renewToken(): Promise<OAuthTokenResponse> {
  // Import env variables lazily to avoid build-time evaluation
  const { GUESTY_CLIENT_ID, GUESTY_CLIENT_SECRET, GUESTY_OAUTH_URL } = await import('../env');

  // Retry token renewal when Guesty rate-limits (429) with backoff
  const MAX_RENEWAL_RETRIES = 3;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RENEWAL_RETRIES; attempt++) {
    const response = await fetch(GUESTY_OAUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'booking_engine:api',
        client_id: GUESTY_CLIENT_ID,
        client_secret: GUESTY_CLIENT_SECRET,
      }),
    });

    // Handle Guesty rate limits on the OAuth endpoint
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : NaN;
      // Use Retry-After if present, otherwise exponential backoff (1s, 2s, 4s)
      const delayMs =
        Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
          ? retryAfterSeconds * 1000
          : 1000 * Math.pow(2, attempt);

      lastError = new Error(`Token renewal rate limited (429). Retrying in ${delayMs}ms.`);
      console.warn('[Token Manager] OAuth rate limited. Retrying...', { attempt: attempt + 1, delayMs });
      await sleep(delayMs);
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text();
      lastError = new Error(`Token renewal failed (${response.status}): ${errorText}`);
      break;
    }

    const data: OAuthTokenResponse = await response.json();
    return data;
  }

  throw lastError || new Error('Token renewal failed after retries');
}

/**
 * Sleep utility for polling
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
