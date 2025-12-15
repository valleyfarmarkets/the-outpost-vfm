import { Hero } from "@/components/home/hero";
import { HoursLocation } from "@/components/home/hours-location";
import { FeaturedHighlights } from "@/components/home/featured-highlights";
import { CabinsShowcase } from "@/components/home/cabins-showcase";

export default function Home() {
  return (
    <>
      <Hero />
      <CabinsShowcase />
      <FeaturedHighlights />
      <HoursLocation />
    </>
  );
}
