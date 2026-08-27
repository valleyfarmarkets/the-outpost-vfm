import type { ReactNode } from "react";
import Link from "next/link";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import {
  temporaryClosureFaqs,
  type TemporaryClosureFaq,
} from "@/data/temporary-closure-faqs";

const temporaryClosureFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: temporaryClosureFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function renderFaqAnswer(faq: TemporaryClosureFaq): ReactNode {
  if (!faq.link) {
    return faq.answer;
  }

  const answerSegments = faq.answer.split(faq.link.text);

  if (answerSegments.length !== 2) {
    throw new Error(
      `FAQ link text must appear exactly once in the answer: ${faq.question}`
    );
  }

  return (
    <>
      {answerSegments[0]}
      <Link
        href={faq.link.href}
        className="decoration-brand-primary/40 hover:text-brand-primary/80 font-semibold text-brand-primary underline underline-offset-2 transition-colors"
      >
        {faq.link.text}
      </Link>
      {answerSegments[1]}
    </>
  );
}

export function TemporaryClosureFaq() {
  const accordionItems = temporaryClosureFaqs.map((faq) => ({
    id: faq.question,
    question: faq.question,
    answer: <p>{renderFaqAnswer(faq)}</p>,
  }));

  return (
    <section className="mt-12" aria-labelledby="temporary-closure-faq-title">
      <script
        id="temporary-closure-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(temporaryClosureFaqSchema),
        }}
      />
      <h2
        id="temporary-closure-faq-title"
        className="scroll-mt-36 text-center font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
      >
        The Outpost Temporary Closure FAQ
      </h2>
      <FaqAccordion items={accordionItems} className="mx-auto mt-8 max-w-3xl" />
    </section>
  );
}
