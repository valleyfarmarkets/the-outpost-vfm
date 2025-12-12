import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rustic Mountain Cabins in Mount Laguna | The Outpost VFM",
  description:
    "Book your perfect mountain escape at The Outpost VFM. 5 unique cabin rentals in Mount Laguna, CA at 6,000 feet elevation. Pet-friendly options, fireplaces, full kitchens. Located in Cleveland National Forest, just 45 minutes from San Diego. Experience stargazing, hiking, and peaceful mountain living.",
  keywords: [
    "Mount Laguna cabins",
    "cabin rentals Mount Laguna",
    "San Diego mountain cabins",
    "Cleveland National Forest lodging",
    "pet-friendly cabins Mount Laguna",
    "fireplace cabins San Diego",
    "vacation rentals Mount Laguna",
    "mountain getaway San Diego",
    "rustic cabins California",
    "Mt Laguna lodging",
    "San Diego backcountry cabins",
    "family cabin rentals",
    "romantic cabin getaway",
    "stargazing cabins California",
    "hiking cabins San Diego",
  ],
  openGraph: {
    title: "Rustic Mountain Cabins in Mount Laguna | The Outpost VFM",
    description:
      "Escape to 6,000 feet elevation. 5 unique cabins with fireplaces, full kitchens, and mountain views. Pet-friendly options available. Just 45 minutes from San Diego.",
    type: "website",
    locale: "en_US",
    siteName: "The Outpost VFM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rustic Mountain Cabins in Mount Laguna | The Outpost VFM",
    description:
      "Escape to 6,000 feet elevation. 5 unique cabins with fireplaces, full kitchens, and mountain views.",
  },
  alternates: {
    canonical: "/cabins",
  },
};

export default function CabinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
