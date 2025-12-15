import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers/providers";
import { BookingModal } from "@/components/booking/booking-modal";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

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
      <body
        className={`${dmSans.variable} ${playfair.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BookingModal />
        </Providers>
      </body>
    </html>
  );
}
