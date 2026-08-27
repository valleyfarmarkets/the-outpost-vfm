import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import faqsData from "@/data/cabin-faqs.json";

export function CabinFAQ() {
  // Sort FAQs by order without mutating the imported content.
  const sortedFaqs = [...faqsData.faqs].sort((a, b) => a.order - b.order);

  // Schema.org FAQPage markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sortedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const accordionItems = sortedFaqs.map((faq) => ({
    id: faq.question,
    question: faq.question,
    answer: <p>{faq.answer}</p>,
    supplementalContent: faq.category ? (
      <span className="bg-brand-accent/10 mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium text-brand-accent">
        {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
      </span>
    ) : undefined,
  }));

  return (
    <>
      <script
        id="cabin-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section className="bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about booking and staying at our
              mountain cabins
            </p>
          </div>

          <FaqAccordion items={accordionItems} className="mx-auto max-w-3xl" />

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Still have questions?{" "}
              <a
                href="tel:+16194582864"
                className="hover:text-brand-primary/80 font-semibold text-brand-primary"
              >
                Call us at (619) 458-2864
              </a>{" "}
              or{" "}
              <a
                href="/contact"
                className="hover:text-brand-primary/80 font-semibold text-brand-primary"
              >
                contact us online
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
