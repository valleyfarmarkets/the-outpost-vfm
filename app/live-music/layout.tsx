import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Music | The Outpost VFM",
  description:
    "Enjoy live music performances at The Outpost VFM in Mount Laguna. Check out our schedule of upcoming shows and events.",
  keywords: [
    "live music",
    "Mount Laguna events",
    "live performances",
    "local music",
    "concerts",
  ],
};

export default function LiveMusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
