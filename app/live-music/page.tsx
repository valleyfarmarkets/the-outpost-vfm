import { formatInTimeZone } from "date-fns-tz";

import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import { LiveMusicClient, type LiveMusicEvent } from "./_components/live-music-client";
import { PerformerSection } from "./_components/performer-section";

export const dynamic = "force-dynamic";

const VENUE_TIMEZONE = "America/Los_Angeles";

interface LiveMusicEventDB {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  ends_at: string | null;
  description: string | null;
  is_published: boolean;
}

function transformEvent(dbEvent: LiveMusicEventDB): LiveMusicEvent {
  const startsAt = new Date(dbEvent.starts_at);
  const endsAt = dbEvent.ends_at ? new Date(dbEvent.ends_at) : null;

  return {
    id: dbEvent.slug,
    artist: dbEvent.title,
    date: formatInTimeZone(startsAt, VENUE_TIMEZONE, "yyyy-MM-dd"),
    startTime: formatInTimeZone(startsAt, VENUE_TIMEZONE, "h:mm a"),
    endTime: endsAt ? formatInTimeZone(endsAt, VENUE_TIMEZONE, "h:mm a") : undefined,
  };
}

export default async function LiveMusicPage() {
  const supabase = await createSupabaseServerClient();

  const { data: dbEvents } = await supabase
    .from("live_music_events")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const events: LiveMusicEvent[] = (dbEvents || []).map(transformEvent);
  const nextEvent = events[0] || null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="max-w-5xl mx-auto px-6 py-12 pt-32">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-wide mb-3 text-amber-100">Live Music</h1>
          <p className="text-neutral-400 max-w-md mx-auto">
            Local artists, mountain vibes, and good times every Friday from 5-8 PM at The Outpost,
            Mt. Laguna.
          </p>
        </div>

        <LiveMusicClient events={events} nextEvent={nextEvent} />

        <PerformerSection />
      </main>
    </div>
  );
}
