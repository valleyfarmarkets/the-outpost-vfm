import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CabinCard } from "@/components/cabins/cabin-card";
import rawCabinsData from "@/data/cabins.json";
import type { CabinData } from "@/types/cabins";

const cabinsData: CabinData = {
  ...rawCabinsData,
  cabins: rawCabinsData.cabins.map((cabin) => ({
    ...cabin,
    priceRange: {
      ...cabin.priceRange,
      unit: cabin.priceRange.unit as CabinData["cabins"][number]["priceRange"]["unit"],
    },
  })),
};

export function CabinGrid() {
  const featuredCabin = cabinsData.cabins.find((cabin) => cabin.featured);
  const regularCabins = cabinsData.cabins.filter((cabin) => !cabin.featured);

  return (
    <Section className="bg-gray-50" id="cabin-grid">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Mountain Retreat
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From cozy studios to spacious family lodges, find your perfect
            escape
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {/* Featured Cabin - Full Width */}
          {featuredCabin && (
            <div>
              <CabinCard
                cabin={featuredCabin}
                bookingUrl={cabinsData.bookingUrl}
                featured
              />
            </div>
          )}

          {/* Regular Cabins - Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularCabins.map((cabin) => (
              <CabinCard
                key={cabin.id}
                cabin={cabin}
                bookingUrl={cabinsData.bookingUrl}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
