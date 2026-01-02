"use client";

import { useState } from "react";
import { PerformerDialog } from "@/components/performers/performer-dialog";

export function PerformerSection() {
  const [performerDialogOpen, setPerformerDialogOpen] = useState(false);

  return (
    <section className="mt-16 text-center">
      <div className="bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-amber-900/30 rounded-2xl p-8 border border-amber-800/30">
        <h3 className="text-2xl font-semibold text-amber-100 mb-2">Want to perform?</h3>
        <p className="text-neutral-400 mb-6 max-w-md mx-auto">
          We&apos;re always looking for talented local artists. Reach out and let&apos;s make some
          music together.
        </p>
        <button
          onClick={() => setPerformerDialogOpen(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Book a Show
        </button>
      </div>

      <PerformerDialog open={performerDialogOpen} onOpenChange={setPerformerDialogOpen} />
    </section>
  );
}
