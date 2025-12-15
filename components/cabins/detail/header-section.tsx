import { Star, MapPin } from "lucide-react";
import type { Cabin, ReviewStats } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  cabin: Cabin;
  reviewStats?: ReviewStats | null;
  className?: string;
}

export function HeaderSection({ cabin, reviewStats, className }: HeaderSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Cabin Name */}
      <h1 className="font-serif text-3xl font-semibold text-[#221F1F] sm:text-4xl">
        {cabin.name}
      </h1>

      {/* Single Info Line: Rating · Reviews · Location */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {reviewStats && reviewStats.totalReviews > 0 && (
          <>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-[#F9AC30]" />
              <span className="font-semibold text-[#221F1F]">
                {reviewStats.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[#6B6966]">·</span>
            <button className="font-medium text-[#221F1F] underline hover:text-[#B13330]">
              {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "review" : "reviews"}
            </button>
            <span className="text-[#6B6966]">·</span>
          </>
        )}
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-[#221F1F]" />
          <span className="font-medium text-[#221F1F]">Mt. Laguna, San Diego County, CA</span>
        </div>
      </div>
    </div>
  );
}
