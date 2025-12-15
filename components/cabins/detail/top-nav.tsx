"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, Share2 } from "lucide-react";

export function TopNav() {
  const [saved, setSaved] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this cabin",
          url: window.location.href,
        })
        .catch(() => {
          // Silently handle cancel/error
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <nav
      className="sticky top-0 z-[100] border-b border-gray-200 bg-[#FFFDF9]"
      style={{ backgroundColor: "#FFFDF9" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-12 py-4">
        {/* Back Link */}
        <Link
          href="/cabins"
          className="flex items-center gap-2 font-sans text-sm font-medium text-[#221F1F] transition-colors hover:text-[#B13330]"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Cabins
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium text-[#221F1F] transition-colors hover:bg-gray-100"
            aria-label="Share cabin"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium text-[#221F1F] transition-colors hover:bg-gray-100"
            aria-label={saved ? "Remove from saved" : "Save cabin"}
          >
            <Heart
              className={`h-4 w-4 ${saved ? "fill-current text-[#B13330]" : ""}`}
            />
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
