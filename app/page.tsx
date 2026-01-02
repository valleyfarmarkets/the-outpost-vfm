import { formatInTimeZone } from "date-fns-tz";

import { Hero } from "@/components/home/hero";
import { HoursLocation } from "@/components/home/hours-location";
import { CabinsShowcase } from "@/components/home/cabins-showcase";
import { MenuSpotlight } from "@/components/menu/menu-spotlight";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

const VENUE_TIMEZONE = "America/Los_Angeles";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const { data: nextEventData } = await supabase
    .from("live_music_events")
    .select("title, starts_at, ends_at")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .single();

  const nextEvent = nextEventData
    ? {
        artist: nextEventData.title,
        date: formatInTimeZone(new Date(nextEventData.starts_at), VENUE_TIMEZONE, "yyyy-MM-dd"),
        startTime: formatInTimeZone(new Date(nextEventData.starts_at), VENUE_TIMEZONE, "h:mm a"),
        endTime: nextEventData.ends_at
          ? formatInTimeZone(new Date(nextEventData.ends_at), VENUE_TIMEZONE, "h:mm a")
          : undefined,
      }
    : null;

  return (
    <>
      <Hero nextEvent={nextEvent} />
      <CabinsShowcase />
      <MenuSpotlight />
      <HoursLocation />
    </>
  );
}
