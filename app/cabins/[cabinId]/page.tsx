import { notFound } from "next/navigation";
import { getCabinById, getReviewsForCabin } from "@/lib/cabin-data";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PhotoGallery } from "@/components/cabins/detail/photo-gallery";
import { HeaderSection } from "@/components/cabins/detail/header-section";
import { HostSection } from "@/components/cabins/detail/host-section";
import { Highlights } from "@/components/cabins/detail/highlights";
import { DescriptionSection } from "@/components/cabins/detail/description-section";
import { SleepingArrangements } from "@/components/cabins/detail/sleeping-arrangements";
import { AmenitiesCategorized } from "@/components/cabins/detail/amenities-categorized";
import { ReviewsSection } from "@/components/cabins/detail/reviews-section";
import { HouseRulesSection } from "@/components/cabins/detail/house-rules-section";
import { CancellationPolicy } from "@/components/cabins/detail/cancellation-policy";
import { BookingCardInline } from "@/components/cabins/detail/booking-card-inline";

interface CabinPageProps {
  params: Promise<{
    cabinId: string;
  }>;
}

export function generateStaticParams() {
  // This will be populated by the build process
  return [
    { cabinId: "hunters-lair" },
    { cabinId: "fishermans-landing" },
    { cabinId: "hikers-haven" },
    { cabinId: "stargazer" },
    { cabinId: "wildlife-lookout" },
  ];
}

export default async function CabinPage({ params }: CabinPageProps) {
  const { cabinId } = await params;
  const cabin = getCabinById(cabinId);

  if (!cabin) {
    notFound();
  }

  const { reviews, stats } = getReviewsForCabin(cabinId);

  return (
    <div className="bg-[#FAF8F5]">
      {/* Header Section */}
      <Section className="pt-36 pb-0 sm:pb-0 lg:pb-0 mb-6">
        <Container className="max-w-[1200px]">
          <HeaderSection cabin={cabin} reviewStats={stats} />
        </Container>
      </Section>

      {/* Photo Gallery */}
      <Container className="max-w-[1200px]">
        <PhotoGallery images={cabin.images} cabinName={cabin.name} />
      </Container>

      {/* Main Content Grid */}
      <div className="pt-12">
        <Container className="max-w-[1200px]">
          <div className="grid gap-20 lg:grid-cols-[1fr_380px]">
            {/* LEFT COLUMN - Main Content */}
            <div className="space-y-10">
              {/* Host Section with Stats */}
              <HostSection cabin={cabin} />

              {/* Highlights */}
              <Highlights highlights={cabin.highlights} />

              {/* Description */}
              <DescriptionSection description={cabin.description} />

              {/* Sleeping Arrangements */}
              <SleepingArrangements bedrooms={cabin.bedroomDetails} />

              {/* Amenities */}
              <AmenitiesCategorized amenities={cabin.amenitiesCategorized} />

              {/* Reviews */}
              {stats && stats.totalReviews > 0 && (
                <ReviewsSection reviews={reviews} stats={stats} />
              )}

              {/* House Rules */}
              <HouseRulesSection rules={cabin.houseRules} />

              {/* Cancellation Policy */}
              <CancellationPolicy policy={cabin.cancellationPolicy} />
            </div>

            {/* RIGHT COLUMN - Sticky Booking Card */}
            <div>
              <BookingCardInline
                cabin={cabin}
                cleaningFee={cabin.cleaningFee}
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
