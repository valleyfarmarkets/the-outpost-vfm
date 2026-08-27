import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { TemporaryClosureFaq } from "@/components/contact/temporary-closure-faq";

export default function ContactPage() {
  return (
    <section className="px-6 pb-20 pt-40">
      <Container>
        <div className="text-center">
          <h1 className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05] tracking-tight text-[#221F1F]">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-gray-600">
            Please review our temporary closure FAQ below before contacting us.
            For questions unrelated to reopening, we&apos;d be glad to hear from
            you.
          </p>
        </div>

        <TemporaryClosureFaq />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </Container>
    </section>
  );
}
