import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "The Outpost VFM | Mountain Restaurant & Cabins",
  description:
    "The Outpost VFM in Mount Laguna - Experience mountain dining and cozy cabin rentals in the beautiful San Diego backcountry.",
  keywords: [
    "Mount Laguna",
    "restaurant",
    "cabins",
    "mountain dining",
    "cabin rentals",
    "San Diego backcountry",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
