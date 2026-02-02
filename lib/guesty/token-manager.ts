import 'server-only';
import { getStoredToken, setStoredToken } from './token-store';
import type { OAuthTokenResponse } from './types';

/**
 * Guesty OAuth Token Manager
 * Implements "Request Coalescing" (Singleton Promise) to prevent rate limits.
 *
 * Strategy:
 * 1. L1 Memory (Fastest, Instance-local)
 * 2. L2 Redis (Shared, Persistent)
 * 3. L3 API (Source, Rate-Limited)
 */

// CONSTANTS
const TOKEN_BUFFER_MS = 5 * 60 * 1000; // 5 minute buffer
const API_TIMEOUT_MS = 15000; // 15s hard timeout for token renewal

// GLOBAL STATE (Per Instance)
let l1MemoryCache: { accessToken: string; expiresAt: number } | null = null;
let renewalPromise: Promise<string> | null = null;

/**
 * Primary Entry Point: Returns a valid token using the 3-layer strategy.
 */
export async function getValidToken(): Promise<string> {
  const now = Date.now();

  // ---------------------------------------------------------
  // LAYER 1: In-Memory Cache (Fastest)
  // ---------------------------------------------------------
  if (l1MemoryCache && l1MemoryCache.expiresAt > now + TOKEN_BUFFER_MS) {
    return l1MemoryCache.accessToken;
  }

  // ---------------------------------------------------------
  // LAYER 2: Request Coalescing (Anti-Fragile)
  // ---------------------------------------------------------
  // If a renewal is in flight, ALL requests wait for it.
  if (renewalPromise) {
    return renewalPromise;
  }

  // ---------------------------------------------------------
  // LAYER 3: Redis & API
  // ---------------------------------------------------------
  renewalPromise = (async () => {
    try {
      // A. Try Redis (L2) - Wrapped to never fail the flow
      try {
        const redisToken = await getStoredToken();
        if (redisToken && redisToken.expiresAt > now + TOKEN_BUFFER_MS) {
          // Hydrate L1
          l1MemoryCache = {
            accessToken: redisToken.accessToken,
            expiresAt: redisToken.expiresAt,
          };
          return redisToken.accessToken;
        }
      } catch (err) {
        console.warn('[Token Manager] Redis read failed, proceeding to renewal', err);
      }

      // B. Renew from Source (L3) with Timeout
      console.log('[Token Manager] Initiating Guesty token renewal...');

      const newToken = await Promise.race([
        renewToken(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Token renewal timed out')), API_TIMEOUT_MS)
        ),
      ]);

      const expiresAt = now + newToken.expires_in * 1000;
      const accessToken = newToken.access_token;

      // C. Update L1 (Critical)
      l1MemoryCache = { accessToken, expiresAt };

      // D. Update L2 (Background/Non-blocking)
      setStoredToken({
        accessToken,
        expiresAt,
        renewalCount: 1,
        renewalResetTime: now,
      }).catch((err) => {
        console.warn('[Token Manager] Redis write failed (non-critical)', err);
      });

      console.log('[Token Manager] Token renewed successfully');
      return accessToken;
    } finally {
      // ALWAYS release the lock
      renewalPromise = null;
    }
  })();

  return renewalPromise;
}

/**
 * API Logic: Handles the actual HTTP call and 429 retries
 */
async function renewToken(): Promise<OAuthTokenResponse> {
  const { GUESTY_CLIENT_ID, GUESTY_CLIENT_SECRET, GUESTY_OAUTH_URL } = await import('../env');

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(GUESTY_OAUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'booking_engine:api',
          client_id: GUESTY_CLIENT_ID,
          client_secret: GUESTY_CLIENT_SECRET,
        }),
        cache: 'no-store', // Bypass Next.js fetch cache
      });

      if (response.ok) {
        return await response.json();
      }

      // Handle 429 specifically
      if (response.status === 429) {
        const retryHeader = response.headers.get('Retry-After');
        const delayMs = retryHeader
          ? parseInt(retryHeader, 10) * 1000
          : 1000 * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s

        console.warn(
          `[Token Manager] 429 Rate Limit. Retrying in ${delayMs}ms (Attempt ${attempt}/${MAX_RETRIES})`
        );
        await sleep(delayMs);
        continue;
      }

      // Handle other errors
      const errorText = await response.text();
      throw new Error(`Guesty API Error ${response.status}: ${errorText}`);
    } catch (error) {
      if (attempt === MAX_RETRIES) throw error;
      // Network errors should also retry
      console.warn(`[Token Manager] Network error during renewal. Retrying...`, error);
      await sleep(1000 * attempt);
    }
  }

  throw new Error('Token renewal failed after maximum retries');
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
