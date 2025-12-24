"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Authentication is not configured");
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("redirect") || "/dashboard";
    const redirectBase =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const { error: supabaseError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectBase}/auth/callback?redirect=${encodeURIComponent(
          redirectTo
        )}`,
      },
    });

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
      return;
    }

    router.push(`/magic-link-sent?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <Card className="w-full max-w-md">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
            Admin Access
          </p>
          <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-600">
            Enter the admin email to receive a magic link. Public sign-up is disabled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@theoutpostvfm.com"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email}
          >
            {loading ? "Sending magic link..." : "Send magic link"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
        <Card className="w-full max-w-md animate-pulse">
          <div className="h-48" />
        </Card>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
