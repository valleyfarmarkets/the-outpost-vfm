"use client";

import { Star } from "lucide-react";
import { ReviewCard } from "./review-card";
import type { CabinReview, ReviewStats } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: CabinReview[];
  stats: ReviewStats | null;
  className?: string;
}

export function ReviewsSection({ reviews, stats, className }: ReviewsSectionProps) {
  if (!stats || reviews.length === 0) {
    return null;
  }

  return (
    <div className={cn("border-t border-gray-200 pt-10", className)}>
      {/* Section Heading */}
      <div className="mb-10 flex items-center gap-2">
        <Star className="h-5 w-5 fill-current text-[#F9AC30]" />
        <h2 className="font-serif text-2xl font-semibold text-[#221F1F]">
          {stats.averageRating.toFixed(1)} · {stats.totalReviews}{" "}
          {stats.totalReviews === 1 ? "review" : "reviews"}
        </h2>
      </div>

      {/* Reviews Grid - 2 columns */}
      <div className="grid gap-x-20 gap-y-10 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show All Reviews Button */}
      <div className="mt-10">
        <button className="rounded-lg border border-[#221F1F] bg-white px-6 py-3 font-sans text-base font-semibold text-[#221F1F] transition-colors hover:bg-gray-50">
          Show all {reviews.length} reviews
        </button>
      </div>
    </div>
  );
}
