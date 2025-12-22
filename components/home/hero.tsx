import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative flex min-h-[600px] items-start bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/outpost_hero.jpeg)' }}>
      <div className="absolute inset-0 bg-black/70" />
      <Container className="relative z-10 pt-40 pb-16 sm:pb-0">
        <div className="mx-auto text-center text-white" style={{ maxWidth: '1200px' }}>
          <h1 className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05] tracking-tight">
            Welcome to The Outpost VFM
          </h1>
          <p className="mt-6 text-lg leading-8 sm:text-xl">
            Experience mountain dining and cozy cabin rentals in the heart of
            Mount Laguna. Your perfect escape to the San Diego backcountry.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/menu">
              <Button
                size="lg"
                variant="primary"
                className="h-14 px-8 text-lg rounded-2xl shadow-xl"
              >
                View Menu
              </Button>
            </Link>
            <Link href="/cabins">
              <Button
                size="lg"
                variant="primary"
                className="h-14 px-8 text-lg rounded-2xl shadow-xl !bg-[#c87524] !text-black !hover:bg-[#b7661e] !focus-visible:ring-[#c87524] border-transparent"
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
