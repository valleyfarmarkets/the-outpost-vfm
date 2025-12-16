import { z } from 'zod';

// Validate server-side env vars
const serverEnvSchema = z.object({
  GUESTY_CLIENT_ID: z.string().min(1),
  GUESTY_CLIENT_SECRET: z.string().min(1),
  GUESTY_API_BASE_URL: z.string().url(),
  GUESTY_OAUTH_URL: z.string().url().default('https://booking.guesty.com/oauth2/token'),
  REDIS_URL: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().optional(),
  QUOTE_EXPIRATION_MINUTES: z.string().default('15'),
  SUPPORT_EMAIL: z.string().email(),
});

// Validate client-side env vars
const clientEnvSchema = z.object({
  NEXT_PUBLIC_ENABLE_GUESTY_BOOKING: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Lazy validation - only parse when first accessed (prevents build crashes)
let _serverEnv: z.infer<typeof serverEnvSchema> | null = null;
let _clientEnv: z.infer<typeof clientEnvSchema> | null = null;

function getServerEnv() {
  if (!_serverEnv) {
    const redisUrl = process.env.REDIS_URL || process.env.STORAGE_REDIS_URL;
    _serverEnv = serverEnvSchema.parse({
      GUESTY_CLIENT_ID: process.env.GUESTY_CLIENT_ID,
      GUESTY_CLIENT_SECRET: process.env.GUESTY_CLIENT_SECRET,
      GUESTY_API_BASE_URL: process.env.GUESTY_API_BASE_URL,
      GUESTY_OAUTH_URL: process.env.GUESTY_OAUTH_URL,
      REDIS_URL: redisUrl,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
      QUOTE_EXPIRATION_MINUTES: process.env.QUOTE_EXPIRATION_MINUTES,
      SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    });
  }
  return _serverEnv;
}

function getClientEnv() {
  if (!_clientEnv) {
    _clientEnv = clientEnvSchema.parse({
      NEXT_PUBLIC_ENABLE_GUESTY_BOOKING: process.env.NEXT_PUBLIC_ENABLE_GUESTY_BOOKING,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }
  return _clientEnv;
}

export const serverEnv = new Proxy({} as z.infer<typeof serverEnvSchema>, {
  get: (_, prop) => getServerEnv()[prop as keyof z.infer<typeof serverEnvSchema>],
});

export const clientEnv = new Proxy({} as z.infer<typeof clientEnvSchema>, {
  get: (_, prop) => getClientEnv()[prop as keyof z.infer<typeof clientEnvSchema>],
});

// Type-safe exports
export const GUESTY_CLIENT_ID = serverEnv.GUESTY_CLIENT_ID;
export const GUESTY_CLIENT_SECRET = serverEnv.GUESTY_CLIENT_SECRET;
export const GUESTY_API_BASE_URL = serverEnv.GUESTY_API_BASE_URL;
export const GUESTY_OAUTH_URL = serverEnv.GUESTY_OAUTH_URL;
export const REDIS_URL = serverEnv.REDIS_URL;
export const STRIPE_SECRET_KEY = serverEnv.STRIPE_SECRET_KEY;
export const QUOTE_EXPIRATION_MS = parseInt(serverEnv.QUOTE_EXPIRATION_MINUTES) * 60 * 1000;
export const SUPPORT_EMAIL = serverEnv.SUPPORT_EMAIL;

export const ENABLE_GUESTY_BOOKING = clientEnv.NEXT_PUBLIC_ENABLE_GUESTY_BOOKING === 'true';
export const STRIPE_PUBLISHABLE_KEY = clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const SUPABASE_URL = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
