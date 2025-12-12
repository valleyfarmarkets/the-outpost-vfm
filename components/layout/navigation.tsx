import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav
      className={cn("flex items-center space-x-6", className)}
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function NavigationLeft({ className }: { className?: string }) {
  const leftLinks = NAV_LINKS.slice(0, 3); // Home, Menu, Cabins

  return (
    <nav
      className={cn("flex items-center gap-4", className)}
      aria-label="Primary navigation"
    >
      {leftLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function NavigationRight({ className }: { className?: string }) {
  const rightLinks = NAV_LINKS.slice(3, 6); // Live Music, Gift Cards, Contact

  return (
    <nav
      className={cn("flex items-center gap-4", className)}
      aria-label="Secondary navigation"
    >
      {rightLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
