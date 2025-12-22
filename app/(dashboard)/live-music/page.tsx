import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

import { PublishToggle } from "./_components/publish-toggle";

const VENUE_TIMEZONE = "America/Los_Angeles";

interface LiveMusicEvent {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  description: string | null;
  is_published: boolean;
}

export default async function LiveMusicDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("live_music_events")
    .select("*")
    .order("starts_at", { ascending: false });

  if (error) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900">Live Music</h2>
        <p className="mt-2 text-sm text-red-600">Failed to load events: {error.message}</p>
      </Card>
    );
  }

  const events = (data || []) as LiveMusicEvent[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
            Admin
          </p>
          <h1 className="text-3xl font-semibold text-gray-900">Live Music</h1>
          <p className="text-sm text-gray-600">
            Manage events in venue timezone (America/Los_Angeles).
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/live-music/new">New event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <p className="text-gray-700">No events yet. Create your first live music event.</p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <div className="col-span-2">Title</div>
            <div>Date/Time (PT)</div>
            <div>Slug</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="grid grid-cols-5 gap-4 px-4 py-4 text-sm">
                <div className="col-span-2">
                  <div className="font-semibold text-gray-900">{event.title}</div>
                  {event.description ? (
                    <p className="text-gray-600">{event.description}</p>
                  ) : null}
                </div>
                <div className="text-gray-900">
                  {formatInTimeZone(
                    event.starts_at,
                    VENUE_TIMEZONE,
                    "MMM d, yyyy 'at' h:mm a zzz"
                  )}
                </div>
                <div className="text-gray-700">{event.slug}</div>
                <div className="flex items-center justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/live-music/${event.id}`}>Edit</Link>
                  </Button>
                  <PublishToggle eventId={event.id} initialPublished={event.is_published} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
