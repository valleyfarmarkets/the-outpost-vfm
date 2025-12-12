import {
  Mountain,
  Trees,
  Compass,
  Car,
  UtensilsCrossed,
  MapPin,
  Flower,
  Sun,
  Leaf,
  Snowflake,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import locationData from "@/data/cabin-location.json";

const iconMap = {
  Mountain,
  Trees,
  Compass,
  Car,
  UtensilsCrossed,
  MapPin,
  Flower,
  Sun,
  Leaf,
  Snowflake,
};

export function LocationExperience() {
  // Schema.org Place markup
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "The Outpost VFM",
    geo: {
      "@type": "GeoCoordinates",
      latitude: locationData.location.coordinates.lat,
      longitude: locationData.location.coordinates.lng,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: locationData.location.address.street,
      addressLocality: locationData.location.address.city,
      addressRegion: locationData.location.address.state,
      postalCode: locationData.location.address.zip,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <Section className="bg-brand-cream">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {locationData.location.headline}
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              {locationData.location.description}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Map Section */}
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 min-h-[400px] flex items-center justify-center">
              {/* TODO: Add Google Maps API key and embed URL */}
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 mx-auto text-brand-primary mb-4" />
                <p className="text-gray-700 font-medium">
                  10608 Sunrise Highway
                  <br />
                  Mount Laguna, CA 91948
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Latitude: {locationData.location.coordinates.lat}
                  <br />
                  Longitude: {locationData.location.coordinates.lng}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${locationData.location.coordinates.lat},${locationData.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-brand-primary hover:text-brand-primary/80 font-semibold"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nearby Attractions
              </h3>
              <div className="space-y-4">
                {locationData.nearbyAttractions.map((attraction) => {
                  const IconComponent =
                    iconMap[attraction.icon as keyof typeof iconMap] ||
                    MapPin;
                  return (
                    <div
                      key={attraction.name}
                      className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-brand-primary" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {attraction.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {attraction.distance}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {attraction.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Seasonal Highlights */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Experience All Four Seasons
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {locationData.seasonalHighlights.map((highlight) => {
                const IconComponent =
                  iconMap[highlight.icon as keyof typeof iconMap] || Sun;
                return (
                  <div
                    key={highlight.season}
                    className="p-6 bg-white rounded-lg shadow-sm text-center"
                  >
                    <IconComponent className="h-10 w-10 mx-auto text-brand-accent mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">
                      {highlight.season}
                    </h4>
                    <p className="text-sm text-brand-primary font-medium mt-1">
                      {highlight.months} • {highlight.temperature}
                    </p>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
