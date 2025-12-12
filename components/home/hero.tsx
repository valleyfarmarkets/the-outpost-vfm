import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative flex min-h-[600px] items-center bg-gradient-to-br from-brand-secondary to-brand-primary">
      <div className="hero-overlay" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to The Outpost VFM
          </h1>
          <p className="mt-6 text-lg leading-8 sm:text-xl">
            Experience mountain dining and cozy cabin rentals in the heart of
            Mount Laguna. Your perfect escape to the San Diego backcountry.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/menu">
              <Button size="lg" variant="primary">
                View Menu
              </Button>
            </Link>
            <Link href="/cabins">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-primary"
              >
                Book a Cabin
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
