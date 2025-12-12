import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { EventCard } from "@/components/live-music/event-card";
import eventsData from "@/data/events.json";

export default function LiveMusicPage() {
  // Filter and sort upcoming events
  const upcomingEvents = eventsData.upcoming
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Section>
      <Container>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Live Music
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Enjoy live performances from talented local and regional artists
          </p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-lg bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-600">
              No upcoming events scheduled at this time.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Check back soon for updates on future performances!
            </p>
          </div>
        )}

        <div className="mt-12 rounded-lg bg-brand-primary/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Interested in Performing?
          </h2>
          <p className="mt-2 text-gray-600">
            We&apos;re always looking for talented musicians to perform at The
            Outpost
          </p>
          <p className="mt-4">
            <a
              href="/contact"
              className="font-semibold text-brand-primary hover:text-brand-primary/80"
            >
              Contact us to learn more →
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
