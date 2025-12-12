import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in USD
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Check if event is upcoming
 */
export function isUpcoming(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

/**
 * Get day of week from date string
 */
export function getDayOfWeek(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
  });
}
