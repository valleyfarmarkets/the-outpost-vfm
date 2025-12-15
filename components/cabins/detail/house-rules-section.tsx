import {
  Clock,
  Ban,
  PartyPopper,
  PawPrint,
  Volume2,
  Cigarette,
  Circle,
} from "lucide-react";
import type { HouseRule } from "@/types/cabins";
import { cn } from "@/lib/utils";

interface HouseRulesSectionProps {
  rules?: HouseRule[];
  className?: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  smoking: Cigarette,
  party: PartyPopper,
  paw: PawPrint,
  quiet: Volume2,
  ban: Ban,
};

function getIcon(iconName: string) {
  const IconComponent = iconMap[iconName] || Circle;
  return IconComponent;
}

export function HouseRulesSection({ rules, className }: HouseRulesSectionProps) {
  if (!rules || rules.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          House Rules
        </h2>
        <p className="mt-2 text-gray-600">
          Please follow these guidelines during your stay
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule, index) => {
          const Icon = getIcon(rule.icon);

          return (
            <div
              key={`${rule.label}-${index}`}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="h-6 w-6 text-brand-primary" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {rule.label}
                </h3>
                {rule.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {rule.description}
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
