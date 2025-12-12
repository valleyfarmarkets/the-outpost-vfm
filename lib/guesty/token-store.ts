import 'server-only';
import { createClient } from 'redis';
import { env } from '../env';
import type { TokenCache } from './types';

/**
 * Redis Token Storage
 *
 * This module provides persistent storage for Guesty OAuth tokens.
 * CRITICAL for serverless environments where in-memory storage is lost between function invocations.
 */

const TOKEN_KEY = 'guesty:oauth:token';

// Create Redis client (singleton pattern)
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: env.redis.url,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
  }

  return redisClient;
}

/**
 * Retrieves the stored OAuth token from Redis
 * @returns TokenCache object or null if not found
 */
export async function getStoredToken(): Promise<TokenCache | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(TOKEN_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as TokenCache;
  } catch (error) {
    console.error('Failed to get stored token from Redis:', error);
    return null;
  }
}

/**
 * Stores the OAuth token in Redis with a 24-hour TTL
 * @param token - TokenCache object containing access token and metadata
 */
export async function setStoredToken(token: TokenCache): Promise<void> {
  try {
    const client = await getRedisClient();

    // Store with 24-hour TTL (86400 seconds) as safety net
    // Guesty tokens expire after 24 hours anyway
    await client.setEx(TOKEN_KEY, 86400, JSON.stringify(token));
  } catch (error) {
    console.error('Failed to set stored token in Redis:', error);
    throw new Error('Token storage failed');
  }
}

/**
 * Deletes the stored OAuth token from Redis
 * Used for cleanup or forced token invalidation
 */
export async function clearStoredToken(): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.del(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear stored token from Redis:', error);
    // Don't throw - cleanup failure shouldn't block operations
  }
}

/**
 * Get a value from Redis (used for locks)
 */
export async function getRedisValue(key: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    return await client.get(key);
  } catch (error) {
    console.error(`Failed to get Redis value for key ${key}:`, error);
    return null;
  }
}

/**
 * Set a value in Redis with expiration (used for locks)
 */
export async function setRedisValue(
  key: string,
  value: string,
  expirationSeconds: number
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.setEx(key, expirationSeconds, value);
  } catch (error) {
    console.error(`Failed to set Redis value for key ${key}:`, error);
    throw error;
  }
}

/**
 * Delete a value from Redis (used for locks)
 */
export async function deleteRedisValue(key: string): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error(`Failed to delete Redis value for key ${key}:`, error);
    // Don't throw - cleanup failure shouldn't block operations
  }
}
