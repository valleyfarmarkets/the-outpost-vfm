"use client";

import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function UserMenu() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
  };

  // Logged out state - show nothing
  if (!session) {
    return null;
  }

  const userEmail = session.user?.email || "Admin";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          aria-label="User menu"
        >
          {userInitial}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          className="z-50 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          {/* User info */}
          <div className="mb-3 border-b border-gray-100 pb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-medium text-gray-900">
              {userEmail}
            </p>
          </div>

          {/* Menu items */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
