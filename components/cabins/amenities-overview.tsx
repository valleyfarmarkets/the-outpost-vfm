import {
  Wifi,
  ParkingCircle,
  ChefHat,
  Thermometer,
  Shirt,
  Flame,
  Waves,
  Utensils,
  Home,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import amenitiesData from "@/data/cabin-amenities.json";

const iconMap = {
  Wifi,
  ParkingCircle,
  ChefHat,
  Thermometer,
  Shirt,
  Flame,
  Waves,
  Utensils,
  Home,
};

export function AmenitiesOverview() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comfort Meets Wilderness
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Every cabin is thoughtfully equipped with modern amenities to make
            your mountain retreat comfortable and memorable
          </p>
        </div>

        {/* Universal Amenities */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Included in Every Cabin
            </h3>
            <p className="mt-2 text-gray-600">
              Standard features across all our mountain retreats
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {amenitiesData.universalAmenities.map((amenity) => {
              const IconComponent =
                iconMap[amenity.icon as keyof typeof iconMap] || Home;
              return (
                <div
                  key={amenity.id}
                  className="flex gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {amenity.label}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {amenity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Amenities */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Premium Features
            </h3>
            <p className="mt-2 text-gray-600">
              Available in select cabins for an enhanced experience
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {amenitiesData.premiumAmenities.map((amenity) => {
              const IconComponent =
                iconMap[amenity.icon as keyof typeof iconMap] || Home;
              return (
                <div
                  key={amenity.id}
                  className="p-6 bg-gradient-to-br from-brand-cream to-white border border-brand-accent/20 rounded-lg text-center hover:shadow-lg transition-shadow"
                >
                  <IconComponent className="h-10 w-10 mx-auto text-brand-accent mb-3" />
                  <h4 className="font-bold text-gray-900">{amenity.label}</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {amenity.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
          <p className="text-center text-gray-700">
            <strong>Note:</strong> Each cabin listing shows its specific
            amenities. Premium features like fireplaces and hot tubs vary by
            cabin. Check individual cabin details above to see what&apos;s included
            in your chosen retreat.
          </p>
        </div>
      </Container>
    </Section>
  );
}
