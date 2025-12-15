import { cn } from "@/lib/utils";

interface DescriptionSectionProps {
  description: string;
  className?: string;
}

export function DescriptionSection({ description, className }: DescriptionSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-bold text-gray-900">
        About This Cabin
      </h2>
      <p className="text-base leading-7 text-gray-700">
        {description}
      </p>
    </div>
  );
}
