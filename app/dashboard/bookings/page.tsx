import { Card } from "@/components/ui/card";

export default function BookingsPage() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-gray-900">Bookings</h2>
      <p className="mt-2 text-gray-700">
        TODO: hook into Supabase bookings table with admin-only RLS and add search, filters, and detail view.
      </p>
    </Card>
  );
}
