import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

import { EventForm } from "../_components/event-form";
import { updateEvent } from "../actions";

interface LiveMusicEvent {
  id: string;
  title: string;
  starts_at: string;
  description: string | null;
  is_published: boolean;
}

export default async function EditLiveMusicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("live_music_events")
    .select("id, title, starts_at, description, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  const event = data as LiveMusicEvent;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
          Admin
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">Edit Live Music Event</h1>
        <p className="text-sm text-gray-600">Times are stored in America/Los_Angeles.</p>
      </div>

      <Card>
        <EventForm
          action={updateEvent.bind(null, event.id)}
          initialEvent={event}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
}
