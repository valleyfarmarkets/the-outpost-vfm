'use server';

import 'server-only';
import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;

/**
 * Returns a shared Redis client instance. Ensures a single connection is reused
 * across invocations to avoid exhausting connection limits in serverless.
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (client && client.isOpen) {
    return client;
  }

  // Import env variable lazily to avoid build-time evaluation
  const { REDIS_URL } = await import('../env');

  client = createClient({ url: REDIS_URL });

  client.on('error', (err) => {
    console.error('[Redis] Client error', err);
  });

  await client.connect();
  return client;
}
