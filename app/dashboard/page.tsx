import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          <p className="mt-2 text-sm text-gray-600">Manage guest reservations and status updates.</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-brand-primary" href="/dashboard/bookings">
            Open bookings →
          </Link>
        </Card>

        <Card className="bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Live Music</h2>
          <p className="mt-2 text-sm text-gray-600">Create, edit, and publish event listings.</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-brand-primary" href="/dashboard/live-music">
            Open live music →
          </Link>
        </Card>

        <Card className="bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2 text-sm text-gray-600">Review inquiries and mark them handled.</p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-brand-primary" href="/dashboard/contact">
            Open contact →
          </Link>
        </Card>
      </section>

      <Card>
        <h3 className="text-xl font-semibold text-gray-900">Next steps</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Wire Supabase session/role guard for this layout before launch.</li>
          <li>Connect server actions to Supabase tables with RLS enabled.</li>
          <li>Add audit logging for admin mutations.</li>
        </ul>
      </Card>
    </div>
  );
}
