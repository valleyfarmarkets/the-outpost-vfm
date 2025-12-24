import { createBrowserClient } from "@supabase/ssr";

type SupabaseClient = ReturnType<typeof createBrowserClient>;

let supabaseInstance: SupabaseClient | null = null;
let initAttempted = false;

/**
 * Get the Supabase browser client.
 * Returns null if environment variables are not configured.
 */
export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (initAttempted) {
    return null;
  }

  initAttempted = true;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      name: "sb",
    },
  });

  return supabaseInstance;
}
