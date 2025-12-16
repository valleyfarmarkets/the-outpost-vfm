"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CabinsHero() {
  const scrollToCabins = () => {
    const cabinSection = document.getElementById("cabin-grid");
    if (cabinSection) {
      cabinSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Schema.org LodgingBusiness structured data
  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "The Outpost VFM Cabins",
    description:
      "Rustic mountain cabin rentals in Mount Laguna, San Diego County. Experience the perfect blend of wilderness beauty and modern comfort at 6,000 feet elevation.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "10600 Sunrise Hwy",
      addressLocality: "Mount Laguna",
      addressRegion: "CA",
      postalCode: "91948",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.8642,
      longitude: -116.4272,
    },
    telephone: "(619) 473-8341",
    priceRange: "$125-$400",
    starRating: {
      "@type": "Rating",
      ratingValue: "4.8",
      bestRating: "5",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with professional cabin exterior hero image */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-terracotta opacity-90" />
          <div className="absolute inset-0 bg-brand-cream/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05] tracking-tight text-white">
            Rustic Mountain Cabins in Mt. Laguna, San Diego
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-white/95 leading-relaxed">
            Escape to 6,000 feet elevation where towering pines meet starlit
            skies. Experience the perfect blend of wilderness beauty and modern
            comfort, just an hour from San Diego. Your mountain retreat awaits
            in Cleveland National Forest.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={scrollToCabins}
              className="bg-white text-brand-primary hover:bg-white/90 hover:text-brand-primary/90 font-semibold shadow-xl w-full sm:w-auto"
            >
              View Available Cabins
            </Button>
            <a
              href="tel:(619) 473-8341"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white rounded-md text-base font-semibold text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call to Book
            </a>
          </div>

          {/* Quick Info Pills */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center text-sm font-medium text-white/90">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              5 Unique Cabins
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              Pet-Friendly Options
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              Wood-Burning Fireplaces
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              45 Min from San Diego
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
