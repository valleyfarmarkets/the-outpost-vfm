import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Cards | The Outpost VFM",
  description:
    "Purchase gift cards for The Outpost VFM. Perfect for dining and cabin rentals in Mount Laguna.",
  keywords: [
    "gift cards",
    "restaurant gift cards",
    "Mount Laguna gifts",
    "cabin rental gifts",
  ],
};

export default function GiftCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
