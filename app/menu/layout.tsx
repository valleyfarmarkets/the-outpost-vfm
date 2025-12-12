import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | The Outpost VFM",
  description:
    "Explore our mountain-inspired menu featuring fresh, locally-sourced ingredients. Breakfast, lunch, and dinner in Mount Laguna.",
  keywords: [
    "restaurant menu",
    "Mount Laguna dining",
    "mountain food",
    "breakfast",
    "lunch",
    "dinner",
  ],
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
