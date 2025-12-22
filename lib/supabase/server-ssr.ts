import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * Server-side Supabase client that reads auth cookies and forwards the session.
 * Note: setAll is a no-op here because server components/actions can't mutate response cookies.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      name: "sb",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
      // No-op setter to satisfy API shape in RSC/server actions
      setAll(cookies) {
        cookies.forEach(() => {});
      },
    },
  });
}

export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user?.app_metadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return { supabase, user: session.user };
}
