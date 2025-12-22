import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectParam = searchParams.get("redirect") || "/dashboard";
  const redirectPath = redirectParam.startsWith("/") ? redirectParam : "/dashboard";
  const response = NextResponse.redirect(new URL(redirectPath, request.url));

  if (!code) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      name: "sb",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", redirectPath);
    signInUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}
