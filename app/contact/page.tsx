import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export default function ContactPage() {
  return (
    <Section className="px-6 pt-40 pb-20">
      <Container>
        <div className="text-center">
          <h1 className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05] tracking-tight text-[#221F1F]">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-gray-600">
            We&apos;d love to hear from you. Get in touch with us today.
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
      </Container>
    </Section>
  );
}
