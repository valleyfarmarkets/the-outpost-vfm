"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import type { MusicEvent } from "@/types/events";
import { SoundWave } from "./sound-wave";

const colors = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  brightGold: "#F9AC30",
};

export function FeaturedShowCard({ show }: { show: MusicEvent }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${colors.deepRed} 0%, #8B2331 100%)`,
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: isHovered
          ? "0 30px 60px rgba(0,0,0,0.4)"
          : "0 15px 40px rgba(0,0,0,0.25)",
        transform: isHovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: show.image ? `url(${show.image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.6s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "32px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              background: colors.brightGold,
              color: colors.charcoal,
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Up Next
          </div>
          <SoundWave />
        </div>

        <div style={{ marginTop: "auto" }}>
          {show.genre && (
            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,
                opacity: 0.8,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {show.genre}
            </div>
          )}

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 700,
              margin: "0 0 16px 0",
              lineHeight: 1.1,
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {show.artist}
          </h2>

          {show.description && (
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                opacity: 0.9,
                marginBottom: "24px",
                maxWidth: "500px",
              }}
            >
              {show.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <Calendar className="h-4 w-4" />
              {new Date(show.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "15px",
              }}
            >
              <Clock className="h-4 w-4" />
              {show.startTime}
              {show.endTime ? ` - ${show.endTime}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "40px",
          height: "40px",
          borderTop: "3px solid rgba(255,255,255,0.3)",
          borderLeft: "3px solid rgba(255,255,255,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderBottom: "3px solid rgba(255,255,255,0.3)",
          borderRight: "3px solid rgba(255,255,255,0.3)",
        }}
      />
    </div>
  );
}
