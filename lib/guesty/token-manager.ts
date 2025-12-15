import 'server-only';
import {
  GUESTY_CLIENT_ID,
  GUESTY_CLIENT_SECRET,
  GUESTY_OAUTH_URL,
} from '../env';
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

  // 🚨 CRITICAL FIX: Check if renewal is already in progress (Lock)
  const isRenewing = await getRedisValue(RENEWAL_LOCK_KEY);
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
  await setRedisValue(RENEWAL_LOCK_KEY, 'true', 10);

  try {
    console.log('[Token Manager] Renewing token...');

    // Renew token
    const newToken = await renewToken();

    // Save to Redis
    await setStoredToken({
      accessToken: newToken.access_token,
      expiresAt: now + newToken.expires_in * 1000,
      renewalCount: (cached?.renewalCount || 0) + 1,
      renewalResetTime: cached?.renewalResetTime || now,
    });

    console.log('[Token Manager] Token renewed successfully');
    return newToken.access_token;
  } finally {
    // Release Lock (even if renewal fails)
    await deleteRedisValue(RENEWAL_LOCK_KEY);
  }
}

/**
 * Renews the Guesty OAuth token via OAuth2 client credentials flow
 *
 * @returns OAuthTokenResponse containing new access token
 * @throws Error if renewal request fails
 */
async function renewToken(): Promise<OAuthTokenResponse> {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token renewal failed (${response.status}): ${errorText}`);
  }

  const data: OAuthTokenResponse = await response.json();
  return data;
}

/**
 * Sleep utility for polling
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
