"use client";

import { useState } from "react";
import type { AmenityCategorized, CabinAmenity } from "@/types/cabins";
import { cn } from "@/lib/utils";
import { getAmenityIcon } from "@/lib/amenity-icons";

interface AmenitiesCategorizedProps {
  amenities?: AmenityCategorized[];
  className?: string;
}

const INITIAL_DISPLAY_COUNT = 10;

export function AmenitiesCategorized({ amenities, className }: AmenitiesCategorizedProps) {
  const [showAll, setShowAll] = useState(false);

  if (!amenities || amenities.length === 0) {
    return null;
  }

  // Flatten all amenities from all categories
  const allAmenities: CabinAmenity[] = amenities.flatMap((category) => category.items);
  const displayedAmenities = showAll
    ? allAmenities
    : allAmenities.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className={cn("border-t border-gray-200 pt-10", className)}>
      {/* Section Header */}
      <h2 className="mb-6 font-serif text-2xl font-semibold text-[#221F1F]">
        What this place offers
      </h2>

      {/* Amenities Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {displayedAmenities.map((amenity, index) => {
          const Icon = getAmenityIcon(amenity.icon);
          return (
            <div key={index} className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-[#221F1F]" />
              <span className="text-base text-[#221F1F]">{amenity.label}</span>
            </div>
          );
        })}
      </div>

      {/* Show All Button */}
      {allAmenities.length > INITIAL_DISPLAY_COUNT && (
        <div className="mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-[#221F1F] bg-white px-6 py-3 font-sans text-base font-semibold text-[#221F1F] transition-colors hover:bg-gray-50"
          >
            {showAll ? "Show less" : `Show all ${allAmenities.length} amenities`}
          </button>
        </div>
      )}
    </div>
  );
}
