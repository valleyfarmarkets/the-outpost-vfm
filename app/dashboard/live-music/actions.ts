'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fromZonedTime } from "date-fns-tz";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireAdminSession } from "@/lib/supabase/server-ssr";

const VENUE_TIMEZONE = "America/Los_Angeles";

const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  description: z.string().optional(),
  is_published: z.boolean().optional().default(false),
});

type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return base.length ? base : "event";
}

async function generateUniqueSlug(
  supabase: SupabaseClient,
  base: string,
  existingId?: string
) {
  let candidate = base;
  let counter = 1;

  // Loop until we find a free slug
  // Uses HEAD query for efficiency
  while (true) {
    const query = supabase
      .from("live_music_events")
      .select("id", { count: "exact", head: true })
      .eq("slug", candidate);

    if (existingId) {
      query.neq("id", existingId);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (!count || count === 0) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

function toUtcIso(date: string, time: string) {
  const iso = fromZonedTime(`${date}T${time}`, VENUE_TIMEZONE).toISOString();
  return iso;
}

export async function createEvent(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState | void> {
  const { supabase } = await requireAdminSession();

  const rawData = {
    title: formData.get("title"),
    date: formData.get("date"),
    time: formData.get("time"),
    description: formData.get("description"),
    is_published: formData.get("is_published") === "on",
  };

  const parsed = EventSchema.safeParse(rawData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const starts_at = toUtcIso(parsed.data.date, parsed.data.time);
  const baseSlug = slugify(parsed.data.title);

  let slug: string;
  try {
    slug = await generateUniqueSlug(supabase, baseSlug);
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Failed to generate slug" };
  }

  const { error } = await supabase.from("live_music_events").insert({
    title: parsed.data.title,
    starts_at,
    description: parsed.data.description,
    is_published: parsed.data.is_published,
    slug,
  });

  if (error) {
    return { message: `Database error: ${error.message}` };
  }

  revalidatePath("/dashboard/live-music");
  redirect("/dashboard/live-music");
}

export async function updateEvent(
  eventId: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState | void> {
  const { supabase } = await requireAdminSession();

  const rawData = {
    title: formData.get("title"),
    date: formData.get("date"),
    time: formData.get("time"),
    description: formData.get("description"),
    is_published: formData.get("is_published") === "on",
  };

  const parsed = EventSchema.safeParse(rawData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const starts_at = toUtcIso(parsed.data.date, parsed.data.time);
  const baseSlug = slugify(parsed.data.title);

  let slug: string;
  try {
    slug = await generateUniqueSlug(supabase, baseSlug, eventId);
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Failed to generate slug" };
  }

  const { error } = await supabase
    .from("live_music_events")
    .update({
      title: parsed.data.title,
      starts_at,
      description: parsed.data.description,
      is_published: parsed.data.is_published,
      slug,
    })
    .eq("id", eventId);

  if (error) {
    return { message: `Database error: ${error.message}` };
  }

  revalidatePath("/dashboard/live-music");
  redirect("/dashboard/live-music");
}

export async function togglePublish(eventId: string, nextPublished: boolean) {
  const { supabase } = await requireAdminSession();

  const { error } = await supabase
    .from("live_music_events")
    .update({ is_published: nextPublished })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/live-music");
  return { success: true };
}
