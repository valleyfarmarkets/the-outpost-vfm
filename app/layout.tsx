import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
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

// Kleader Sans Fonts
const kleaderSansRough = localFont({
  src: "../public/fonts/Kleader Sans Rough.woff",
  variable: "--font-kleader-sans-rough",
  display: "swap",
});

const kleaderSansRegular = localFont({
  src: "../public/fonts/Kleader Sans Regular.woff",
  variable: "--font-kleader-sans-regular",
  display: "swap",
});

const kleaderSansStamp = localFont({
  src: "../public/fonts/Kleader Sans Stamp.woff",
  variable: "--font-kleader-sans-stamp",
  display: "swap",
});

// Kleader Serif Fonts
const kleaderSerifRough = localFont({
  src: "../public/fonts/Kleader Serif Rough.woff",
  variable: "--font-kleader-serif-rough",
  display: "swap",
});

const kleaderSerifRegular = localFont({
  src: "../public/fonts/Kleader Serif Regular.woff",
  variable: "--font-kleader-serif-regular",
  display: "swap",
});

const kleaderSerifStamp = localFont({
  src: "../public/fonts/Kleader Serif Stamp.woff",
  variable: "--font-kleader-serif-stamp",
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
    <html lang="en" className="bg-white">
      <body
        className={`${dmSans.variable} ${kleaderSansRough.variable} ${kleaderSansRegular.variable} ${kleaderSansStamp.variable} ${kleaderSerifRough.variable} ${kleaderSerifRegular.variable} ${kleaderSerifStamp.variable} flex min-h-screen flex-col font-sans antialiased`}
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
