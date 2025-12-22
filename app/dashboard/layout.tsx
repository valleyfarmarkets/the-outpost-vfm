import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-semibold text-gray-900">The Outpost VFM</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
            <Link className="hover:text-brand-primary" href="/dashboard">
              Overview
            </Link>
            <Link className="hover:text-brand-primary" href="/dashboard/bookings">
              Bookings
            </Link>
            <Link className="hover:text-brand-primary" href="/dashboard/live-music">
              Live Music
            </Link>
            <Link className="hover:text-brand-primary" href="/dashboard/contact">
              Contact
            </Link>
          </nav>
        </header>

        <main className="space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
