import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        hover &&
          "transition-transform duration-300 hover:scale-105 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
