import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "blue" | "purple" | "orange" | "gray";
  className?: string;
}

export function Badge({ children, variant = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-green-100 text-green-800": variant === "green",
          "bg-blue-100 text-blue-800": variant === "blue",
          "bg-purple-100 text-purple-800": variant === "purple",
          "bg-orange-100 text-orange-800": variant === "orange",
          "bg-gray-100 text-gray-800": variant === "gray",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
