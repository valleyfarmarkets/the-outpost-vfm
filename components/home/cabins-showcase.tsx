"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rawCabinsData from "@/data/cabins.json";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { CabinData } from "@/types/cabins";
import { CabinCard } from "./cabin-card";
import { CarouselPagination } from "./carousel-pagination";

const palette = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
  goldenAmber: "#DE9A2E",
  brightGold: "#F9AC30",
  warmWhite: "#FFFDF9",
  cream: "#FAF8F5",
};

const cabinsData = rawCabinsData as CabinData;

export function CabinsShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Section
      className="bg-gradient-to-b from-[rgba(250,248,245,1)] to-[rgba(245,240,232,1)]"
      style={
        {
          "--cabins-charcoal": palette.charcoal,
          "--cabins-bright": palette.brightGold,
          "--cabins-burnt": palette.burntOrange,
          "--cabins-golden": palette.goldenAmber,
        } as CSSProperties
      }
    >
      <Container>
        <div className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--cabins-charcoal)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--cabins-bright)]" />
            Mt. Laguna, CA
          </p>
          <h2 className="mt-4 text-3xl font-serif tracking-tight text-[var(--cabins-charcoal)] sm:text-4xl">
            Rustic Mountain Cabins
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Five handcrafted retreats where modern comfort meets mountain
            serenity.
          </p>
        </div>

        {/* Carousel */}
        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {cabinsData.cabins.map((cabin) => (
              <div
                key={cabin.id}
                className="min-w-0 pl-6 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <CabinCard cabin={cabin} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <CarouselPagination
          totalSlides={cabinsData.cabins.length}
          selectedIndex={selectedIndex}
          onDotClick={scrollTo}
        />

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link
            href="/cabins"
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-[var(--cabins-charcoal)] shadow-lg transition-all",
              "bg-[var(--cabins-burnt)] hover:bg-[var(--cabins-golden)] hover:-translate-y-0.5"
            )}
            style={
              {
                "--cabins-golden": palette.goldenAmber,
              } as CSSProperties
            }
          >
            Book a Cabin
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-gray-600">
            Prefer to chat? Call us at{" "}
            <a
              href="tel:6194738341"
              className="font-semibold text-[var(--cabins-charcoal)] underline underline-offset-2"
            >
              (619) 473-8341
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
