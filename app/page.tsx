import { Hero } from "@/components/home/hero";
import { HoursLocation } from "@/components/home/hours-location";
import { FeaturedHighlights } from "@/components/home/featured-highlights";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedHighlights />
      <HoursLocation />
    </>
  );
}
