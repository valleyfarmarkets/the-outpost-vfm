"use client";

import { useState } from "react";
import { PerformerDialog } from "@/components/performers/performer-dialog";

const colors = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
};

export function PerformerSection() {
  const [performerDialogOpen, setPerformerDialogOpen] = useState(false);

  return (
    <section
      style={{
        marginTop: "80px",
        background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.burntOrange} 100%)`,
        borderRadius: "24px",
        padding: "48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      />

      <div style={{ position: "relative" }}>
        <h2
          className="font-serif"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "36px",
            fontWeight: 600,
            color: "#fff",
            margin: "0 0 16px 0",
          }}
        >
          Want to perform?
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "400px",
            margin: "0 auto 28px",
            lineHeight: 1.6,
          }}
        >
          We are always looking for talented local artists. Reach out and let us make some music together.
        </p>
        <button
          onClick={() => setPerformerDialogOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#fff",
            color: colors.charcoal,
            padding: "16px 32px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 600,
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Book a Show
        </button>
      </div>

      <PerformerDialog
        open={performerDialogOpen}
        onOpenChange={setPerformerDialogOpen}
      />
    </section>
  );
}
