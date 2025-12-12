import { Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CabinCard } from "@/components/cabins/cabin-card";
import cabinsData from "@/data/cabins.json";

export default function CabinsPage() {
  return (
    <Section>
      <Container>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Cabins
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Cozy mountain retreats with modern amenities and stunning views
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {cabinsData.cabins.map((cabin) => (
            <CabinCard
              key={cabin.id}
              cabin={cabin}
              bookingUrl={cabinsData.bookingUrl}
            />
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-brand-primary/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Questions About Booking?
          </h2>
          <p className="mt-2 text-gray-600">
            Call us directly to check availability and make reservations
          </p>
          <a
            href={`tel:${cabinsData.bookingPhone}`}
            className="mt-4 inline-flex items-center text-lg font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            <Phone className="mr-2 h-5 w-5" />
            {cabinsData.bookingPhone}
          </a>
        </div>
      </Container>
    </Section>
  );
}
