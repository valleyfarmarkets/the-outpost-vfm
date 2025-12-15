import type { Cabin } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface HostSectionProps {
  cabin: Cabin;
  className?: string;
}

export function HostSection({ cabin, className }: HostSectionProps) {
  // Calculate total beds from bedroom details if available
  const totalBeds = cabin.bedroomDetails
    ? cabin.bedroomDetails.reduce(
        (sum, bedroom) =>
          sum + bedroom.beds.reduce((bedSum, bed) => bedSum + bed.count, 0),
        0
      )
    : cabin.bedrooms;

  const hostName = cabin.host?.name || "Valley Farm Market";
  const hostInitials = cabin.host?.initials || "VF";

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-gray-200 pb-6",
        className
      )}
    >
      {/* Left Side: Host Info & Stats */}
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#221F1F]">
          Entire cabin hosted by {hostName}
        </h2>
        <p className="mt-2 text-base text-[#6B6966]">
          {cabin.capacity} guests · {cabin.bedrooms} bedroom
          {cabin.bedrooms > 1 ? "s" : ""} · {totalBeds} bed
          {totalBeds > 1 ? "s" : ""} · {cabin.bathrooms} bath
          {cabin.bathrooms > 1 ? "s" : ""}
        </p>
      </div>

      {/* Right Side: Profile Badge */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#B13330] to-[#CE7C23] text-white"
        aria-label={`Hosted by ${hostName}`}
      >
        <span className="font-sans text-lg font-semibold">{hostInitials}</span>
      </div>
    </div>
  );
}
