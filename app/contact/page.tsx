import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { MapEmbed } from "@/components/contact/map-embed";

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We'd love to hear from you. Get in touch with us today.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Find Us on the Map
          </h2>
          <MapEmbed />
        </div>
      </Container>
    </Section>
  );
}
