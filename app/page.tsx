import { Hero } from "@/components/home/hero";
import { HoursLocation } from "@/components/home/hours-location";
import { CabinsShowcase } from "@/components/home/cabins-showcase";
import { MenuSpotlight } from "@/components/menu/menu-spotlight";

export default function Home() {
  return (
    <>
      <Hero />
      <CabinsShowcase />
      <MenuSpotlight />
      <HoursLocation />
    </>
  );
}
