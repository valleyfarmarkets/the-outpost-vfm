'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
  Flame,
  PawPrint,
  Star,
  Users,
} from "lucide-react";
import rawCabinsData from "@/data/cabins.json";
import { cn } from "@/lib/utils";
import type { Cabin, CabinData } from "@/types/cabins";

type CabinDisplay = {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  sleeps: number;
  bedrooms: number;
  beds?: number;
  baths: number;
  sqft?: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  tags: string[];
  images: string[];
};

const palette = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
  goldenAmber: "#DE9A2E",
  brightGold: "#F9AC30",
  cream: "#FAF8F5",
  warmWhite: "#FFFDF9",
  textMuted: "#6B6966",
  lightGray: "#E8E4DE",
} as const;

const cabinOverrides: Record<
  Cabin["id"],
  Partial<
    Pick<
      CabinDisplay,
      | "tagline"
      | "description"
      | "pricePerNight"
      | "rating"
      | "reviewCount"
      | "sqft"
      | "tags"
      | "amenities"
    >
  >
> = {
  "hunters-lair": {
    tagline: "Where the wild calls home",
    description:
      "Our largest cabin, perfect for families or groups seeking adventure. Expansive deck with BBQ, wood-burning fireplace, and stunning mountain views.",
    pricePerNight: 189,
    rating: 4.9,
    reviewCount: 47,
    sqft: 850,
  },
  "hikers-haven": {
    tagline: "Rest between adventures",
    description:
      "Cozy retreat with direct trail access to the PCT. Wake up, lace up, and hit the trails—then return to comfort and warmth.",
    pricePerNight: 159,
    rating: 4.8,
    reviewCount: 32,
    sqft: 650,
  },
  "fishermans-landing": {
    tagline: "Cast your worries away",
    description:
      "Our most secluded cabin with private creek access. Ideal for anglers and those seeking true tranquility in nature.",
    pricePerNight: 229,
    rating: 4.9,
    reviewCount: 28,
    sqft: 1100,
    tags: ["Largest"],
  },
  stargazer: {
    tagline: "Nights under infinite skies",
    description:
      "Intimate cabin with a skylight over the bed and private hot tub. Perfect for couples or solo travelers seeking romance and wonder.",
    pricePerNight: 149,
    rating: 5,
    reviewCount: 53,
    sqft: 450,
    tags: ["Most Popular", "Pet Friendly"],
  },
  "wildlife-lookout": {
    tagline: "Nature's front row seat",
    description:
      "Elevated cabin with panoramic windows and observation deck. Binoculars included—you'll spot deer, hawks, and maybe even a bobcat.",
    pricePerNight: 179,
    rating: 4.7,
    reviewCount: 19,
    sqft: 750,
  },
};

const cabinsData = rawCabinsData as CabinData;

const getTotalBeds = (cabin: Cabin): number | undefined => {
  if (!cabin.bedroomDetails) return undefined;

  return cabin.bedroomDetails.reduce((total, bedroom) => {
    return (
      total +
      bedroom.beds.reduce((bedTotal, bed) => {
        return bedTotal + bed.count;
      }, 0)
    );
  }, 0);
};

const buildCabins = (): CabinDisplay[] => {
  const largestCapacity = Math.max(
    ...cabinsData.cabins.map((cabin) => cabin.capacity),
  );

  return cabinsData.cabins.map((cabin) => {
    const overrides = cabinOverrides[cabin.id] ?? {};
    const tagSet = new Set(overrides.tags ?? []);

    if (cabin.petFriendly) {
      tagSet.add("Pet Friendly");
    }
    if (cabin.featured) {
      tagSet.add("Most Popular");
    }
    if (cabin.capacity === largestCapacity) {
      tagSet.add("Largest");
    }

    const amenities =
      overrides.amenities ??
      cabin.amenities.map((amenity) => amenity.label ?? amenity.icon);

    return {
      id: cabin.id,
      name: cabin.name,
      tagline:
        overrides.tagline ?? cabin.personalityTag ?? cabin.shortDescription,
      description: overrides.description ?? cabin.description,
      sleeps: cabin.capacity,
      bedrooms: cabin.bedrooms,
      beds: getTotalBeds(cabin),
      baths: cabin.bathrooms,
      sqft: overrides.sqft,
      pricePerNight: overrides.pricePerNight ?? cabin.priceRange.min,
      rating: overrides.rating ?? 4.8,
      reviewCount: overrides.reviewCount ?? 24,
      amenities,
      tags: Array.from(tagSet),
      images: cabin.images,
    };
  });
};

const StarIcon = () => (
  <Star className="h-4 w-4 fill-[#F9AC30] text-[#F9AC30]" strokeWidth={2} />
);

type ImageGalleryProps = {
  images: string[];
  tags: string[];
};

function ImageGallery({ images, tags }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-full w-full overflow-hidden rounded-xl"
    >
      <img
        src={images[currentIndex]}
        alt="Cabin exterior"
        className={cn(
          "h-full w-full object-cover transition duration-500 ease-in-out",
          isHovered ? "scale-[1.03]" : "scale-100",
        )}
      />

      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
        {tags.includes("Pet Friendly") && (
          <span className="flex items-center gap-1 rounded-full bg-[#4A7C59] px-3 py-1 text-xs font-semibold text-white shadow">
            <PawPrint className="h-3.5 w-3.5" />
            Pet Friendly
          </span>
        )}
        {tags.includes("Most Popular") && (
          <span className="flex items-center gap-1 rounded-full bg-[#F9AC30] px-3 py-1 text-xs font-semibold text-[#221F1F] shadow">
            ★ Most Popular
          </span>
        )}
        {tags.includes("Largest") && (
          <span className="flex items-center gap-1 rounded-full bg-[#CE7C23] px-3 py-1 text-xs font-semibold text-white shadow">
            Largest Cabin
          </span>
        )}
      </div>

      {isHovered && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#221F1F] shadow transition hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#221F1F] shadow transition hover:scale-105"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, idx) => (
          <span
            key={`${idx}-${images[idx]}`}
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-white/50 transition",
              idx === currentIndex && "bg-white",
            )}
          />
        ))}
      </div>
    </div>
  );
}

type CabinRowProps = {
  cabin: CabinDisplay;
};

function CabinRow({ cabin }: CabinRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "overflow-hidden rounded-2xl border bg-[#FFFDF9] transition duration-300",
        "shadow-sm hover:-translate-y-1 hover:shadow-2xl",
        "border-[#E8E4DE]",
      )}
    >
      <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-[#221F1F]">
            {cabin.name}
          </h3>
          {cabin.tagline && (
            <p className="font-sans text-sm italic text-[#CE7C23]">
              {cabin.tagline}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[#FAF8F5] px-3 py-2">
          <StarIcon />
          <span className="font-semibold text-[#221F1F]">
            {cabin.rating.toFixed(1)}
          </span>
          <span className="text-sm text-[#6B6966]">
            ({cabin.reviewCount})
          </span>
        </div>
      </div>

      <div className="grid gap-6 px-6 pb-6 md:grid-cols-[minmax(0,360px)_1fr] md:px-8 md:pb-8">
        <div className="h-[220px] md:h-[260px]">
          <ImageGallery images={cabin.images} tags={cabin.tags} />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-sans text-sm leading-6 text-[#6B6966]">
            {cabin.description}
          </p>

          <div className="flex flex-wrap gap-4 border-b border-[#E8E4DE] pb-4">
            <div className="flex items-center gap-2 text-[#221F1F]">
              <Users className="h-4 w-4 opacity-60" />
              <span className="text-sm">{cabin.sleeps} guests</span>
            </div>
            <div className="flex items-center gap-2 text-[#221F1F]">
              <Bed className="h-4 w-4 opacity-60" />
              <span className="text-sm">
                {cabin.bedrooms} BR
                {typeof cabin.beds === "number" ? ` · ${cabin.beds} beds` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#221F1F]">
              <Bath className="h-4 w-4 opacity-60" />
              <span className="text-sm">
                {cabin.baths} bath{cabin.baths > 1 ? "s" : ""}
              </span>
            </div>
            {cabin.sqft && (
              <div className="text-sm text-[#6B6966]">{cabin.sqft} sq ft</div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {cabin.amenities.slice(0, 5).map((amenity) => (
              <span
                key={`${cabin.id}-${amenity}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-3 py-1 text-xs font-medium text-[#221F1F]"
              >
                {amenity.toLowerCase().includes("fire") && (
                  <Flame className="h-3.5 w-3.5" />
                )}
                {amenity}
              </span>
            ))}
            {cabin.amenities.length > 5 && (
              <span className="inline-flex items-center rounded-full bg-[#FAF8F5] px-3 py-1 text-xs font-medium text-[#221F1F]">
                +{cabin.amenities.length - 5} more
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            <div>
              <span className="font-sans text-2xl font-bold text-[#221F1F]">
                ${cabin.pricePerNight}
              </span>
              <span className="ml-1 font-sans text-sm text-[#6B6966]">
                / night
              </span>
            </div>
            <Link
              href={`/cabins/${cabin.id}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition",
                hovered
                  ? "bg-gradient-to-br from-[#B13330] to-[#CE7C23]"
                  : "bg-[#221F1F]",
              )}
            >
              View Cabin
              <ArrowRight
                className={cn(
                  "h-4 w-4 transition",
                  hovered ? "translate-x-1" : "translate-x-0",
                )}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

type SortOption =
  | "recommended"
  | "price-low-high"
  | "price-high-low"
  | "most-popular"
  | "capacity";

export function CabinsListing() {
  const [showPetFriendly, setShowPetFriendly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");

  const cabins = useMemo(buildCabins, []);

  const visibleCabins = useMemo(() => {
    const filtered = cabins.filter(
      (cabin) => !showPetFriendly || cabin.tags.includes("Pet Friendly"),
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-low-high":
          return a.pricePerNight - b.pricePerNight;
        case "price-high-low":
          return b.pricePerNight - a.pricePerNight;
        case "most-popular":
          return b.reviewCount - a.reviewCount;
        case "capacity":
          return b.sleeps - a.sleeps;
        default:
          return Number(b.tags.includes("Most Popular")) -
            Number(a.tags.includes("Most Popular")) ||
            b.rating - a.rating;
      }
    });

    return sorted;
  }, [cabins, showPetFriendly, sortOption]);

  return (
    <div
      className="min-h-screen bg-[#FAF8F5]"
      style={{ color: palette.charcoal, backgroundColor: palette.cream }}
    >
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${palette.deepRed} 0%, ${palette.burntOrange} 25%, ${palette.goldenAmber} 50%, ${palette.brightGold} 75%, ${palette.goldenAmber} 100%)`,
        }}
      />

      <section className="px-4 py-12 text-center md:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-4xl font-semibold text-[#221F1F] sm:text-5xl md:text-6xl">
            Our Mountain Cabins
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6B6966] sm:text-lg">
            Five handcrafted retreats in the heart of Cleveland National
            Forest. Each cabin offers its own character, but all share one
            thing: the peace of the mountains, just 45 minutes from San Diego.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 pb-8">
        <span className="text-sm text-[#6B6966]">
          {visibleCabins.length} cabins available
        </span>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowPetFriendly((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition",
              showPetFriendly
                ? "border-[#4A7C59] bg-[#4A7C59] text-white"
                : "border-[#E8E4DE] bg-[#FFFDF9] text-[#221F1F]",
            )}
          >
            <PawPrint className="h-4 w-4" />
            Pet Friendly
          </button>
          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            className="rounded-lg border border-[#E8E4DE] bg-[#FFFDF9] px-4 py-2 text-sm text-[#221F1F] shadow-sm"
          >
            <option value="recommended">Sort by: Recommended</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="most-popular">Most Popular</option>
            <option value="capacity">Guests: Most</option>
          </select>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <div className="flex flex-col gap-8">
          {visibleCabins.map((cabin) => (
            <CabinRow key={cabin.id} cabin={cabin} />
          ))}
        </div>
      </main>

      <section className="bg-[#221F1F] px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold">Need help choosing?</h2>
          <p className="mt-3 text-base text-white/70">
            Give us a call and we&apos;ll help you find the perfect cabin for
            your getaway.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+16195551234"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#F9AC30] to-[#DE9A2E] px-5 py-3 text-base font-semibold text-[#221F1F]"
            >
              Call (619) 555-1234
            </a>
            <a
              href="mailto:reservations@theoutpostvfm.com"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-base font-semibold text-white"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
