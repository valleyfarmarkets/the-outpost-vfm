import {
  Wifi,
  Flame,
  Car,
  Coffee,
  Refrigerator,
  Microwave,
  Utensils,
  Mountain,
  Wind,
  Snowflake,
  ShowerHead,
  Sparkles,
  Home,
  Circle,
} from "lucide-react";
import type { AmenityCategorized } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface AmenityCategoryProps {
  category: AmenityCategorized;
  className?: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  fireplace: Flame,
  parking: Car,
  coffee: Coffee,
  fridge: Refrigerator,
  microwave: Microwave,
  kitchen: Utensils,
  mountain: Mountain,
  deck: Home,
  grill: Utensils,
  "fire-pit": Flame,
  heating: Wind,
  cooling: Snowflake,
  shower: ShowerHead,
  linens: Sparkles,
  towels: Sparkles,
};

function getIcon(iconName: string) {
  const IconComponent = iconMap[iconName] || Circle;
  return IconComponent;
}

export function AmenityCategory({ category, className }: AmenityCategoryProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Category Header */}
      <h3 className="text-lg font-semibold text-gray-900">
        {category.category}
      </h3>

      {/* Amenities Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {category.items.map((amenity, index) => {
          const Icon = getIcon(amenity.icon);

          return (
            <div
              key={`${amenity.label}-${index}`}
              className="flex items-start gap-3"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="h-5 w-5 text-brand-primary" />
              </div>

              {/* Label & Description */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{amenity.label}</p>
                {amenity.description && (
                  <p className="mt-0.5 text-sm text-gray-600">
                    {amenity.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
