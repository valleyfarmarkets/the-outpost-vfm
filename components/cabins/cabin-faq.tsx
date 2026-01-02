"use client";

import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import faqsData from "@/data/cabin-faqs.json";

export function CabinFAQ() {
  // Schema.org FAQPage markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Sort FAQs by order
  const sortedFaqs = [...faqsData.faqs].sort((a, b) => a.order - b.order);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section className="bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about booking and staying at our
              mountain cabins
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {sortedFaqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-brand-primary flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  {faq.category && (
                    <span className="inline-block mt-3 px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-medium rounded-full">
                      {faq.category.charAt(0).toUpperCase() +
                        faq.category.slice(1)}
                    </span>
                  )}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Still have questions?{" "}
              <a
                href="tel:+16194582864"
                className="font-semibold text-brand-primary hover:text-brand-primary/80"
              >
                Call us at (619) 458-2864
              </a>{" "}
              or{" "}
              <a
                href="/contact"
                className="font-semibold text-brand-primary hover:text-brand-primary/80"
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
