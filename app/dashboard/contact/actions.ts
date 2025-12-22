'use server';

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/server-ssr";

export async function updateStatus(id: string, status: "new" | "handled") {
  const { supabase } = await requireAdminSession();

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/contact");
  return { success: true };
}
