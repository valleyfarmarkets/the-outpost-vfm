import Link from "next/link";
import { Container } from "@/components/ui/container";
import { TEMPORARY_CLOSURE_FAQ_PATH } from "@/lib/constants";

const HERO_CTA_BASE_CLASSES =
  "inline-flex h-14 w-full items-center justify-center rounded-2xl px-8 text-lg font-medium shadow-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto";

export function Hero() {
  return (
    <section
      className="relative flex min-h-[600px] items-start bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/outpost_hero.jpeg)" }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <Container className="relative z-10 pb-16 pt-40 sm:pb-0">
        <div
          className="mx-auto text-center text-white"
          style={{ maxWidth: "1200px" }}
        >
          <h1 className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05] tracking-tight">
            THE OUTPOST IS TEMPORARILY CLOSED
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 sm:text-xl">
            Our restaurant is currently closed while we complete required
            repairs. We don&apos;t have a confirmed reopening date yet, but our
            cabins remain open and available to book.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={TEMPORARY_CLOSURE_FAQ_PATH}
              className={`${HERO_CTA_BASE_CLASSES} hover:bg-brand-primary/90 bg-brand-primary text-white focus-visible:ring-brand-primary`}
            >
              View Closure FAQ
            </Link>
            <Link
              href="/cabins"
              className={`${HERO_CTA_BASE_CLASSES} bg-[#c87524] text-black hover:bg-[#b7661e] focus-visible:ring-[#c87524]`}
            >
              Book a Cabin
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
