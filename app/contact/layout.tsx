import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | The Outpost VFM",
  description:
    "Find temporary closure information, reopening updates, and contact details for The Outpost VFM in Mount Laguna.",
  keywords: [
    "contact",
    "Mount Laguna contact",
    "temporary closure",
    "reopening updates",
    "restaurant hours",
    "directions",
    "location",
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
