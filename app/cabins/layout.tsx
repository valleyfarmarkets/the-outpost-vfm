import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cabins | The Outpost VFM",
  description:
    "Book cozy mountain cabins in Mount Laguna. Perfect for families and groups seeking a peaceful escape to the San Diego backcountry.",
  keywords: [
    "Mount Laguna cabins",
    "cabin rentals",
    "mountain cabins",
    "San Diego cabins",
    "vacation rentals",
  ],
};

export default function CabinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
