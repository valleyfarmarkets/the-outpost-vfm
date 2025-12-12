import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | The Outpost VFM",
  description:
    "Get in touch with The Outpost VFM. Find our address, phone number, email, and hours of operation in Mount Laguna.",
  keywords: [
    "contact",
    "Mount Laguna contact",
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
