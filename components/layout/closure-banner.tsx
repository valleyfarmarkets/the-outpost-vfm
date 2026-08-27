"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { TEMPORARY_CLOSURE_FAQ_PATH } from "@/lib/constants";

const STORAGE_KEY = "closure-banner-dismissed";

export function ClosureBanner() {
  // Start with null to avoid hydration mismatch
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    // Check sessionStorage on mount
    const dismissed = sessionStorage.getItem(STORAGE_KEY) === "true";
    setIsDismissed(dismissed);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  };

  // Don't render anything until we've checked sessionStorage (prevents flash)
  if (isDismissed === null || isDismissed) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 top-[68px] z-[45] bg-brand-primary py-2 text-center text-sm font-medium text-white lg:top-1">
      <div className="relative px-10">
        Restaurant temporarily closed for repairs. Cabins remain open.{" "}
        <Link
          href={TEMPORARY_CLOSURE_FAQ_PATH}
          className="underline transition-opacity hover:opacity-80"
        >
          View reopening FAQ <span aria-hidden="true">→</span>
        </Link>
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-80"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
