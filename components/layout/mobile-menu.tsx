"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle drag-to-close
  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    // Close if dragged down more than 150px or with significant velocity
    if (info.offset.y > 150 || info.velocity.y > 500) {
      setIsOpen(false);
    }
  };

  return (
    <div className="lg:hidden">
      {/* 1. OPEN BUTTON (Hamburger) */}
      {/* This sits in the header and only handles OPENING */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Open menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
          <span className="w-full h-0.5 bg-current" />
          <span className="w-full h-0.5 bg-current" />
          <span className="w-full h-0.5 bg-current" />
        </div>
      </button>

      {/* 2. FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            // FIXED: Solid bg-black ensures no transparency issues
            // z-[9999] ensures it covers the entire UI including the header
            className="fixed inset-0 z-[9999] bg-black flex flex-col h-[100dvh]"
          >
            {/* Overlay Header with Logo & Close Button */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  src="/images/outpost_logo_2.svg"
                  width={120}
                  height={35}
                  alt="The Outpost VFM"
                  className="h-9 w-auto"
                />
              </Link>

              {/* FIXED: Close Button is now INSIDE the overlay */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                  <span className="absolute w-full h-0.5 bg-current rotate-45" />
                  <span className="absolute w-full h-0.5 bg-current -rotate-45" />
                </div>
              </button>
            </div>

            {/* Navigation Links - Centered */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-6 w-full pb-20">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl md:text-5xl font-serif font-medium text-white tracking-tight
                    hover:text-brand-primary hover:scale-105
                    transition-all duration-300 ease-out"
                >
                  {link.label}
                </Link>
              ))}

              {/* Book a Cabin CTA */}
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="mt-8 px-8 py-4 bg-brand-primary text-white text-xl font-bold
                  uppercase tracking-wider rounded-md
                  hover:bg-brand-primary/90 transition-colors"
              >
                Book a Cabin
              </Link>
            </nav>

            {/* Drag Handle / Close Hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <p className="text-white/50 text-sm font-medium">Swipe down to close</p>
              <div className="w-12 h-1 bg-white/30 rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
