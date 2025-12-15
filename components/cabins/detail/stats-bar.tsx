import { Users, Bed, Bath } from "lucide-react";
import type { Cabin } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  cabin: Cabin;
  className?: string;
}

export function StatsBar({ cabin, className }: StatsBarProps) {
  const stats = [
    {
      icon: Users,
      label: `Sleeps ${cabin.capacity}`,
      value: cabin.capacity,
    },
    {
      icon: Bed,
      label: `${cabin.bedrooms} Bedroom${cabin.bedrooms > 1 ? "s" : ""}`,
      value: cabin.bedrooms,
    },
    {
      icon: Bath,
      label: `${cabin.bathrooms} Bathroom${cabin.bathrooms > 1 ? "s" : ""}`,
      value: cabin.bathrooms,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap gap-6 rounded-xl border border-gray-200 bg-white p-6",
        className
      )}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="flex items-center gap-3">
            {index > 0 && (
              <div className="hidden h-10 w-px bg-gray-200 sm:block" />
            )}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10">
              <Icon className="h-6 w-6 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accommodates</p>
              <p className="font-semibold text-gray-900">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
