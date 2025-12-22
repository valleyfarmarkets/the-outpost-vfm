"use client";

import { useActionState } from "react";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const VENUE_TIMEZONE = "America/Los_Angeles";

type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

type FormAction = (prevState: ActionState, formData: FormData) => Promise<ActionState | void>;

interface EventFormProps {
  action: FormAction;
  initialEvent?: {
    id: string;
    title: string;
    starts_at: string;
    description: string | null;
    is_published: boolean;
  };
  submitLabel: string;
}

function getDefaultDateTime(startsAt?: string) {
  if (!startsAt) {
    return { date: "", time: "" };
  }

  return {
    date: formatInTimeZone(startsAt, VENUE_TIMEZONE, "yyyy-MM-dd"),
    time: formatInTimeZone(startsAt, VENUE_TIMEZONE, "HH:mm"),
  };
}

export function EventForm({ action, initialEvent, submitLabel }: EventFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action as (state: ActionState, payload: FormData) => Promise<ActionState>,
    null
  );

  const defaults = getDefaultDateTime(initialEvent?.starts_at);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initialEvent?.title ?? ""}
          placeholder="Saturday Night Live Music"
        />
        {state?.fieldErrors?.title ? (
          <p className="text-sm text-red-600">{state.fieldErrors.title.join(", ")}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date (venue time)</Label>
          <Input id="date" name="date" type="date" required defaultValue={defaults.date} />
          {state?.fieldErrors?.date ? (
            <p className="text-sm text-red-600">{state.fieldErrors.date.join(", ")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Start time (venue time)</Label>
          <Input id="time" name="time" type="time" required defaultValue={defaults.time} />
          {state?.fieldErrors?.time ? (
            <p className="text-sm text-red-600">{state.fieldErrors.time.join(", ")}</p>
          ) : null}
          <p className="text-xs text-gray-500">Times are treated as America/Los_Angeles.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialEvent?.description ?? ""}
          placeholder="Band name, genre, cover charge, special notes..."
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-gray-800">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={initialEvent?.is_published ?? false}
          className="h-4 w-4"
        />
        Publish on site
      </label>

      <div className="space-y-2">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Saving..." : submitLabel}
        </Button>
        {state?.message ? <p className="text-sm text-red-600">{state.message}</p> : null}
      </div>
    </form>
  );
}
