"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { NavigationLeft, NavigationRight } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // { passive: true } improves scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
      {/*
         pointer-events-none on wrapper allows clicking through header area
         pointer-events-auto on pill re-enables clicks on navigation
      */}

      {/* --- DESKTOP PILL --- */}
      <div
        className={cn(
          "hidden lg:flex items-center pointer-events-auto",
          "rounded-full border shadow-lg backdrop-blur-md",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]", // Premium iOS-style bezier
          isScrolled
            ? "bg-white/80 border-white/40 py-2 px-4" // Scrolled: Compact, high contrast
            : "bg-white/30 border-white/40 py-3 px-8" // Top: Airy, transparent
        )}
      >
        {/* 1. SCROLLED LOGO (Left) - Slides in from 0 width */}
        <Link
          href="/"
          className={cn(
            "relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            isScrolled ? "w-8 opacity-100 mr-6" : "w-0 opacity-0 mr-0"
          )}
        >
          <Image
            src="/images/outpost_logo_2.svg" // Using same logo as fallback
            alt="Home"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>

        {/* 2. LEFT NAV - Stays in DOM, slides physically to make room */}
        <NavigationLeft />

        {/* 3. CENTER LOGO (Top) - Slides closed to 0 width */}
        <Link
          href="/"
          className={cn(
            "relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex justify-center",
            isScrolled ? "w-0 opacity-0 mx-0" : "w-[160px] opacity-100 mx-8"
          )}
        >
          <Image
            src="/images/outpost_logo_2.svg"
            alt="The Outpost VFM"
            width={160}
            height={44}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* 4. RIGHT NAV - Always visible */}
        <NavigationRight />
      </div>

      {/* --- MOBILE NAV (Unchanged) --- */}
      <div className="lg:hidden pointer-events-auto w-full">
        <div className="bg-white/90 backdrop-blur-md border-b py-4">
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
