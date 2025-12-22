import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

import { StatusToggle } from "./_components/status-toggle";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "handled";
  created_at: string;
}

export default async function ContactDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900">Contact submissions</h2>
        <p className="mt-2 text-sm text-red-600">Failed to load submissions: {error.message}</p>
      </Card>
    );
  }

  const submissions = (data || []) as ContactSubmission[];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
          Admin
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">Contact submissions</h1>
        <p className="text-sm text-gray-600">
          View and mark inquiries handled. Sorted newest first.
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <p className="text-gray-700">No submissions yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <Card key={submission.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{submission.name}</span>
                    <span className="text-gray-500">{submission.email}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(submission.created_at), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={submission.status === "handled" ? "green" : "gray"}>
                    {submission.status}
                  </Badge>
                  <StatusToggle
                    submissionId={submission.id}
                    initialStatus={submission.status}
                  />
                </div>
              </div>
              <p className="whitespace-pre-line text-sm text-gray-800">{submission.message}</p>
              <div className="flex justify-end">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  <a href={`mailto:${submission.email}`}>Reply via email</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
