import 'server-only';
import { kv } from '@vercel/kv';
import type { TokenCache } from './types';

/**
 * Vercel KV (Redis) Token Storage
 *
 * This module provides persistent storage for Guesty OAuth tokens.
 * CRITICAL for serverless environments where in-memory storage is lost between function invocations.
 */

const TOKEN_KEY = 'guesty:oauth:token';

/**
 * Retrieves the stored OAuth token from Vercel KV
 * @returns TokenCache object or null if not found
 */
export async function getStoredToken(): Promise<TokenCache | null> {
  try {
    const token = await kv.get<TokenCache>(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Failed to get stored token from KV:', error);
    return null;
  }
}

/**
 * Stores the OAuth token in Vercel KV with a 24-hour TTL
 * @param token - TokenCache object containing access token and metadata
 */
export async function setStoredToken(token: TokenCache): Promise<void> {
  try {
    // Store with 24-hour TTL (86400 seconds) as safety net
    // Guesty tokens expire after 24 hours anyway
    await kv.set(TOKEN_KEY, token, { ex: 86400 });
  } catch (error) {
    console.error('Failed to set stored token in KV:', error);
    throw new Error('Token storage failed');
  }
}

/**
 * Deletes the stored OAuth token from Vercel KV
 * Used for cleanup or forced token invalidation
 */
export async function clearStoredToken(): Promise<void> {
  try {
    await kv.del(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear stored token from KV:', error);
    // Don't throw - cleanup failure shouldn't block operations
  }
}
