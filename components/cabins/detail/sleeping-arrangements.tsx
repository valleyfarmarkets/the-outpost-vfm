import { BedroomCard } from "./bedroom-card";
import type { BedroomInfo } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface SleepingArrangementsProps {
  bedrooms?: BedroomInfo[];
  className?: string;
}

export function SleepingArrangements({ bedrooms, className }: SleepingArrangementsProps) {
  if (!bedrooms || bedrooms.length === 0) {
    return null;
  }

  // Calculate total sleeping capacity
  const totalBeds = bedrooms.reduce((total, bedroom) => {
    return total + bedroom.beds.reduce((sum, bed) => sum + bed.count, 0);
  }, 0);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-serif text-gray-900">
          Where You&apos;ll Sleep
        </h2>
        <p className="mt-2 text-gray-600">
          {bedrooms.length} {bedrooms.length === 1 ? "bedroom" : "bedrooms"} · {totalBeds} {totalBeds === 1 ? "bed" : "beds"}
        </p>
      </div>

      {/* Bedrooms Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {bedrooms.map((bedroom) => (
          <BedroomCard key={bedroom.id} bedroom={bedroom} />
        ))}
      </div>
    </div>
  );
}
