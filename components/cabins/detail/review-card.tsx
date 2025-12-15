import { Star } from "lucide-react";
import type { CabinReview } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: CabinReview;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const formattedDate = new Date(review.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Author Header */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#221F1F] text-sm font-semibold text-white">
          {review.author.avatar || review.author.name.substring(0, 2).toUpperCase()}
        </div>

        {/* Name, Location & Date */}
        <div className="min-w-0 flex-1">
          <h4 className="font-sans text-base font-semibold text-[#221F1F]">
            {review.author.name}
          </h4>
          <p className="text-sm text-[#6B6966]">
            {review.author.location} · {formattedDate}
          </p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < review.rating
                ? "fill-current text-[#221F1F]"
                : "fill-none text-gray-300"
            )}
          />
        ))}
      </div>

      {/* Review Comment */}
      <p className="text-base leading-relaxed text-[#221F1F]">{review.comment}</p>
    </div>
  );
}
