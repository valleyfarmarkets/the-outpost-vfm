import { Card } from "@/components/ui/card";

import { EventForm } from "../_components/event-form";
import { createEvent } from "../actions";

export default function NewLiveMusicPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
          Admin
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">New Live Music Event</h1>
        <p className="text-sm text-gray-600">Times are stored in America/Los_Angeles.</p>
      </div>

      <Card>
        <EventForm action={createEvent} submitLabel="Create event" />
      </Card>
    </div>
  );
}
