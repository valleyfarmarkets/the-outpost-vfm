import { CabinsHero } from "@/components/cabins/cabins-hero";
import { CabinsIntro } from "@/components/cabins/cabins-intro";
import { CabinGrid } from "@/components/cabins/cabin-grid";
import { LocationExperience } from "@/components/cabins/location-experience";
import { AmenitiesOverview } from "@/components/cabins/amenities-overview";
import { CabinFAQ } from "@/components/cabins/cabin-faq";
import { CabinCTAFooter } from "@/components/cabins/cabin-cta-footer";

export default function CabinsPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <CabinsHero />

      {/* 2. Intro Paragraph */}
      <CabinsIntro />

      {/* 3. Cabin Grid */}
      <CabinGrid />

      {/* 4. Location & Experience */}
      <LocationExperience />

      {/* 5. Amenities Overview */}
      <AmenitiesOverview />

      {/* 6. FAQ Section */}
      <CabinFAQ />

      {/* 7. Final CTA + Trust Signals */}
      <CabinCTAFooter />
    </>
  );
}
