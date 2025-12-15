import {
  Mountain,
  Flame,
  Calendar,
  Anchor,
  Footprints,
  Stars,
  Binoculars,
  Leaf,
  PawPrint,
  type LucideIcon,
} from "lucide-react";
import type { CabinHighlight } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface HighlightsProps {
  highlights?: CabinHighlight[];
  className?: string;
}

// Map icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  mountain: Mountain,
  fireplace: Flame,
  calendar: Calendar,
  anchor: Anchor,
  hiking: Footprints,
  footprints: Footprints,
  stars: Stars,
  binoculars: Binoculars,
  leaf: Leaf,
  paw: PawPrint,
};

export function Highlights({ highlights, className }: HighlightsProps) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6 border-b border-gray-200 pb-8", className)}>
      {highlights.map((highlight, index) => {
        const Icon = iconMap[highlight.icon] || Mountain;

        return (
          <div key={index} className="flex gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-[#B13330]" />
            </div>

            {/* Text Content */}
            <div>
              <h3 className="font-sans text-base font-semibold text-[#221F1F]">
                {highlight.title}
              </h3>
              <p className="mt-1 text-sm text-[#6B6966]">
                {highlight.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
