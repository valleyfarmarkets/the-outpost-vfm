import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bed, Bath, Users, Mountain } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { CabinData } from "@/types/cabins";
import { getAmenityIcon } from "@/lib/amenity-icons";

const palette = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
  goldenAmber: "#DE9A2E",
  brightGold: "#F9AC30",
  warmWhite: "#FFFDF9",
  cream: "#FAF8F5",
};

interface CabinCardProps {
  cabin: CabinData["cabins"][number];
}

export function CabinCard({ cabin }: CabinCardProps) {
  const priceLabel = `$${cabin.priceRange.min} - $${cabin.priceRange.max}/${cabin.priceRange.unit}`;
  const featureBadges = cabin.amenities.slice(0, 3);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--cabins-warmWhite)] shadow-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:shadow-2xl"
      style={
        {
          "--cabins-warmWhite": palette.warmWhite,
          "--cabins-charcoal": palette.charcoal,
          "--cabins-gold": palette.brightGold,
          "--cabins-amber": palette.goldenAmber,
          "--cabins-burnt": palette.burntOrange,
          "--cabins-red": palette.deepRed,
          "--cabins-bright": palette.brightGold,
        } as CSSProperties
      }
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={cabin.images[0]}
          alt={cabin.name}
          fill
          priority={false}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <div className="absolute top-4 right-4 rounded-full bg-[var(--cabins-warmWhite)] px-3.5 py-2 text-sm font-semibold text-[var(--cabins-charcoal)] shadow-lg">
          {priceLabel}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-semibold text-white drop-shadow-md">
            {cabin.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--cabins-burnt)]">
          <Mountain className="h-4 w-4" />
          {cabin.personalityTag || cabin.shortDescription}
        </p>

        <div className="flex items-center gap-6 border-b border-black/10 pb-4 text-sm text-[var(--cabins-charcoal)]">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 opacity-70" />
            Sleeps {cabin.capacity}
          </span>
          <span className="flex items-center gap-2">
            <Bed className="h-4 w-4 opacity-70" />
            {cabin.bedrooms} bed{cabin.bedrooms > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-2">
            <Bath className="h-4 w-4 opacity-70" />
            {cabin.bathrooms} bath{cabin.bathrooms > 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-sm text-gray-700">{cabin.shortDescription}</p>

        <div className="flex flex-wrap gap-2">
          {featureBadges.map((feature) => {
            const Icon = getAmenityIcon(feature.icon);
            return (
              <span
                key={feature.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cabins-amber)]/20 bg-gradient-to-br from-[var(--cabins-cream)] to-[var(--cabins-gold)]/10 px-3 py-1 text-xs font-semibold text-[var(--cabins-charcoal)]"
              >
                <Icon className="h-3.5 w-3.5" />
                {feature.label}
              </span>
            );
          })}
        </div>

        <Link
          href={`/cabins/${cabin.id}`}
          className={cn(
            "mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all",
            "bg-gradient-to-r from-[var(--cabins-charcoal)] to-[var(--cabins-red)]",
            "hover:from-[var(--cabins-red)] hover:to-[var(--cabins-burnt)] hover:shadow-lg"
          )}
        >
          View Cabin
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--cabins-red)] via-[var(--cabins-burnt)] to-[var(--cabins-amber)]" />
    </article>
  );
}
