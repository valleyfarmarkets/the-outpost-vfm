"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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

  return (
    <div className="lg:hidden">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative z-[60] inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Overlay / Drawer Container */}
      {/* We use distinct states for visibility to allow animations if desired, 
          but keeping it simple and functional here */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          
          {/* 1. The Backdrop (Darkens the site behind the menu) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />

          {/* 2. The Drawer Panel (The actual menu) */}
          <div className="relative z-10 h-full w-full max-w-sm bg-stone-900 shadow-2xl flex flex-col p-6">
            
            {/* Close Button Header */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            {/* Navigation Links - Centered Vertically and Horizontally */}
            <nav
              className="flex flex-col items-center justify-center flex-1 gap-8"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-serif text-3xl font-medium text-white tracking-wide hover:text-brand-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Optional: Footer or CTA in the drawer */}
            <div className="mt-auto pt-8 border-t border-white/10 text-center">
               <Link 
                 href="/book" 
                 className="inline-block w-full rounded-md bg-brand-primary px-4 py-3 text-white font-bold uppercase tracking-wider"
                 onClick={() => setIsOpen(false)}
               >
                 Book a Cabin
               </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}