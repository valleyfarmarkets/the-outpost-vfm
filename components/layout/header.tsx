"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { NavigationLeft, NavigationRight } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // { passive: true } improves scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header on pages with custom headers
  const shouldHideHeader = pathname === "/live-music" || pathname === "/menu" || pathname.startsWith("/cabins/");

  if (shouldHideHeader) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
      {/* --- DESKTOP PILL --- */}
      <div
        className={cn(
          "hidden lg:flex items-center pointer-events-auto",
          "rounded-full shadow-lg backdrop-blur-md",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isScrolled
            ? "bg-white/95 py-2.5 px-8"
            : "bg-white/40 py-3 px-10"
        )}
      >
        {/* 1. SCROLLED LOGO (Left) - Slides in, overlaps pill vertically */}
        <Link
          href="/"
          className={cn(
            "relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex-shrink-0",
            isScrolled ? "w-11 opacity-100 mr-6" : "w-0 opacity-0 mr-0"
          )}
        >
          <Image
            src="/images/outpost_logo_2.svg"
            alt="Home"
            width={44}
            height={44}
            className="object-contain -my-3"
          />
        </Link>

        {/* 2. LEFT NAV */}
        <NavigationLeft />

        {/* 3. CENTER LOGO - Large, overlaps outside the pill */}
        <Link
          href="/"
          className={cn(
            "relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex justify-center flex-shrink-0",
            isScrolled ? "w-0 opacity-0 mx-0" : "w-[72px] opacity-100 mx-10"
          )}
        >
          <Image
            src="/images/outpost_logo_2.svg"
            alt="The Outpost VFM"
            width={72}
            height={72}
            priority
            className="w-[72px] h-[72px] object-contain -my-5"
          />
        </Link>

        {/* 4. RIGHT NAV - Maintains spacing when scrolled */}
        <NavigationRight className={cn(isScrolled && "ml-4")} />
      </div>

      {/* --- MOBILE NAV --- */}
      <div className="lg:hidden pointer-events-auto w-full">
        <div className="bg-white/95 backdrop-blur-md shadow-sm py-4">
          <Container>
            <div className="flex items-center justify-between">
              <Link href="/">
                <Image
                  src="/images/outpost_logo_2.svg"
                  width={140}
                  height={40}
                  alt="The Outpost VFM"
                  className="h-10 w-auto"
                />
              </Link>
              <MobileMenu />
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
