import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brand-primary text-white hover:bg-brand-primary/90 focus-visible:ring-brand-primary":
              variant === "primary",
            "bg-brand-secondary text-white hover:bg-brand-secondary/90 focus-visible:ring-brand-secondary":
              variant === "secondary",
            "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus-visible:ring-brand-primary":
              variant === "outline",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-13 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
