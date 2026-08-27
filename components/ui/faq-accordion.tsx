import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqAccordionItem {
  readonly id: string;
  readonly question: string;
  readonly answer: ReactNode;
  readonly supplementalContent?: ReactNode;
}

interface FaqAccordionProps {
  readonly items: readonly FaqAccordionItem[];
  readonly className?: string;
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => (
        <details
          key={item.id}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary [&::-webkit-details-marker]:hidden">
            <h3 className="pr-4 text-lg font-semibold text-gray-900">
              {item.question}
            </h3>
            <ChevronDown
              aria-hidden="true"
              className="h-5 w-5 flex-shrink-0 text-brand-primary transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="px-6 pb-6">
            <div className="leading-relaxed text-gray-700">{item.answer}</div>
            {item.supplementalContent}
          </div>
        </details>
      ))}
    </div>
  );
}
