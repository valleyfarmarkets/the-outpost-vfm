import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!supabaseUrl || !serviceRoleKey || !adminEmail) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ADMIN_EMAIL env var");
}

async function main() {
  const supabase = createClient(supabaseUrl!, serviceRoleKey!);

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(adminEmail!, {
    data: { role: "admin" },
  });

  if (error) {
    console.error("Failed to invite admin user:", error.message);
    process.exit(1);
  }

  console.log("Invited admin user:", data.user?.email);
}

main();
