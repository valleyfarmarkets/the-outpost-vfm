import { Bed } from "lucide-react";
import type { BedroomInfo, BedDetail } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface BedroomCardProps {
  bedroom: BedroomInfo;
  className?: string;
}

const bedTypeIcons: Record<BedDetail["type"], string> = {
  King: "👑",
  Queen: "♕",
  Full: "▪",
  Twin: "▫",
  Bunk: "⚏",
  "Sofa Bed": "🛋",
};

function getBedLabel(bed: BedDetail): string {
  const count = bed.count;
  const type = bed.type;

  if (count === 1) {
    return `1 ${type} bed`;
  }

  return `${count} ${type} beds`;
}

export function BedroomCard({ bedroom, className }: BedroomCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {/* Bedroom Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
          <Bed className="h-5 w-5 text-brand-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{bedroom.name}</h3>
      </div>

      {/* Bed Details */}
      <div className="mt-4 space-y-3">
        {bedroom.beds.map((bed, index) => (
          <div
            key={`${bed.type}-${index}`}
            className="flex items-center gap-3 text-gray-700"
          >
            <span className="text-2xl" role="img" aria-label={bed.type}>
              {bedTypeIcons[bed.type]}
            </span>
            <span className="text-sm font-medium">{getBedLabel(bed)}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      {bedroom.features && bedroom.features.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <ul className="space-y-2">
            {bedroom.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
