import 'server-only';

// Validate server-side environment variables
const requiredServerEnv = [
  'GUESTY_CLIENT_ID',
  'GUESTY_CLIENT_SECRET',
  'GUESTY_API_BASE_URL',
  'GUESTY_OAUTH_URL',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'STRIPE_SECRET_KEY',
] as const;

for (const key of requiredServerEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Validate client-side environment variables
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}

// Export validated environment variables (type-safe)
export const env = {
  guesty: {
    clientId: process.env.GUESTY_CLIENT_ID!,
    clientSecret: process.env.GUESTY_CLIENT_SECRET!,
    apiBaseUrl: process.env.GUESTY_API_BASE_URL!,
    oauthUrl: process.env.GUESTY_OAUTH_URL!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
  kv: {
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  },
} as const;
