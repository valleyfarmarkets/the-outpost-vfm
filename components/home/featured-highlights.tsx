import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import rawMenuData from "@/data/menu.json";
import rawCabinsData from "@/data/cabins.json";
import eventsData from "@/data/events.json";
import type { DietaryTag, MenuData } from "@/types/menu";
import type { CabinData } from "@/types/cabins";

const menuData: MenuData = {
  ...rawMenuData,
  categories: rawMenuData.categories.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      dietaryTags: item.dietaryTags as DietaryTag[] | undefined,
    })),
  })),
};

const cabinsData = {
  ...rawCabinsData,
  cabins: rawCabinsData.cabins.map((cabin) => ({
    ...cabin,
    priceRange: {
      ...cabin.priceRange,
      unit: cabin.priceRange.unit as "night" | "week",
    },
  })) as CabinData["cabins"],
};

export function FeaturedHighlights() {
  // Get featured items
  const featuredMenuItems = menuData.categories
    .flatMap((category) => category.items)
    .filter((item) => item.featured)
    .slice(0, 2);

  const featuredCabin = cabinsData.cabins[0]; // First cabin as featured
  const featuredEvent = eventsData.upcoming.find((event) => event.featured);

  return (
    <Section>
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Highlights
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover what makes The Outpost VFM special
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured Menu Items */}
          {featuredMenuItems.map((item) => (
            <Card key={item.id} hover>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="green">Featured Dish</Badge>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {item.name}
                  </h3>
                </div>
                <p className="text-lg font-bold text-brand-primary">
                  {formatPrice(item.price)}
                </p>
              </div>
              <p className="mt-3 text-sm text-gray-600">{item.description}</p>
              <Link href="/menu" className="mt-4 block">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Menu
                </Button>
              </Link>
            </Card>
          ))}

          {/* Featured Cabin */}
          {featuredCabin && (
            <Card hover>
              <Badge variant="blue">Featured Cabin</Badge>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                {featuredCabin.name}
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                {featuredCabin.shortDescription}
              </p>
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  Sleeps {featuredCabin.capacity} • {featuredCabin.bedrooms}{" "}
                  Bedrooms • {featuredCabin.bathrooms} Bathrooms
                </p>
                <p className="mt-1 font-semibold text-brand-primary">
                  {formatPrice(featuredCabin.priceRange.min)} -{" "}
                  {formatPrice(featuredCabin.priceRange.max)} per{" "}
                  {featuredCabin.priceRange.unit}
                </p>
              </div>
              <Link href="/cabins" className="mt-4 block">
                <Button variant="outline" size="sm" className="w-full">
                  View All Cabins
                </Button>
              </Link>
            </Card>
          )}

          {/* Featured Event */}
          {featuredEvent && (
            <Card hover>
              <Badge variant="purple">Upcoming Event</Badge>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                {featuredEvent.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-primary">
                {featuredEvent.artist}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">{featuredEvent.startTime}</p>
              <Link href="/live-music" className="mt-4 block">
                <Button variant="outline" size="sm" className="w-full">
                  See All Events
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </Container>
    </Section>
  );
}
