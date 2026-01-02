"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import type { MusicEvent } from "@/types/events";

const colors = {
  charcoal: "#221F1F",
  burntOrange: "#CE7C23",
  warmWhite: "#FFFDF9",
  textMuted: "#6B6966",
  lightGray: "#E8E4DE",
};

export function UpcomingShowCard({ show }: { show: MusicEvent }) {
  const [isHovered, setIsHovered] = useState(false);
  const day = useMemo(
    () => new Date(show.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    [show.date]
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        background: colors.warmWhite,
        borderRadius: "16px",
        border: `1px solid ${colors.lightGray}`,
        cursor: "pointer",
        boxShadow: isHovered
          ? "0 12px 32px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: isHovered ? "translateX(8px)" : "translateX(0)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "120px",
          borderRadius: "12px",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
          background: colors.burntOrange,
        }}
      >
        {show.image && (
          <Image
            src={show.image}
            alt={show.artist}
            fill
            sizes="100px"
            style={{
              objectFit: "cover",
              opacity: 0.7,
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)",
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {show.genre && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: colors.burntOrange,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {show.genre}
          </div>
        )}
        <h4
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 600,
            color: colors.charcoal,
            margin: "0 0 8px 0",
          }}
        >
          {show.artist}
        </h4>
        {show.description && (
          <p
            style={{
              fontSize: "13px",
              color: colors.textMuted,
              margin: "0 0 12px 0",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {show.description}
          </p>
        )}
        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "13px",
            color: colors.charcoal,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Calendar className="h-4 w-4" /> {day}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock className="h-4 w-4" /> {show.startTime}
            {show.endTime ? ` - ${show.endTime}` : ""}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: isHovered ? colors.burntOrange : colors.lightGray,
          transition: "color 0.3s ease",
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
}
