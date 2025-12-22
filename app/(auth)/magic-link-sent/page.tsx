interface MagicLinkSentPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function MagicLinkSentPage({ searchParams }: MagicLinkSentPageProps) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
          Check your inbox
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Magic link sent</h1>
        <p className="mt-3 text-gray-700">
          We sent a sign-in link to {email ? <span className="font-semibold">{email}</span> : "your email"}.
          Open it on this device to enter the admin dashboard.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          If you don’t see it within a minute, check spam or request another link from the sign-in page.
        </p>
      </div>
    </div>
  );
}
