"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { NavigationLeft, NavigationRight } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-1 lg:top-11 left-0 right-0 z-50 flex justify-center lg:pt-6 pointer-events-none">
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

        {/* 5. USER MENU - Shows when logged in */}
        <div className="ml-4">
          <UserMenu />
        </div>
      </div>

      {/* --- MOBILE NAV --- */}
      <div className="lg:hidden pointer-events-auto w-full">
        {/* Added bg-black explicitly here to ensure the bar itself is visible */}
        <div className="bg-black text-white shadow-sm py-3">
          <Container>
            <div className="flex items-center justify-between">
              <Link href="/">
                <Image
                  src="/images/outpost_logo_2.svg"
                  width={140}
                  height={40}
                  alt="The Outpost VFM"
                  className="h-10 w-auto invert brightness-0 filter"
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
