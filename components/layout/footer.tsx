"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { NAV_LINKS } from "@/lib/constants";
import siteInfo from "@/data/site-info.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate footer container
      gsap.from(footerRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
      });

      // Stagger animate columns
      const columns = columnsRef.current?.children;
      if (columns) {
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#221e1e]">
      <Container>
        <div ref={columnsRef} className="grid gap-6 py-8 md:grid-cols-3">
          <div>
            <Image
              src="/images/outpost_logo_2.svg"
              alt="The Outpost VFM"
              width={150}
              height={40}
              className="mb-3 h-8 w-auto"
            />
            <p className="text-sm text-gray-400">{siteInfo.tagline}</p>
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-100">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-brand-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-100">
              Contact Us
            </h3>
            <address className="text-sm not-italic text-gray-400">
              <p className="whitespace-pre-line">
                {siteInfo.contact.address.full ??
                  `${siteInfo.contact.address.street}\n${siteInfo.contact.address.city}, ${siteInfo.contact.address.state}, ${siteInfo.contact.address.zip}`}
              </p>
              <p className="mt-2">
                <a
                  href={`tel:${siteInfo.contact.phone}`}
                  className="hover:text-brand-primary"
                >
                  {siteInfo.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteInfo.contact.email}`}
                  className="hover:text-brand-primary"
                >
                  {siteInfo.contact.email}
                </a>
              </p>
            </address>

            <div className="mt-4 flex space-x-4">
              {siteInfo.social.facebook && (
                <a
                  href={siteInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteInfo.social.instagram && (
                <a
                  href={siteInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} The Outpost VFM. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
