"use client";

import { useState } from "react";
import Image from "next/image";

export interface PosterData {
  id: number;
  artist: string;
  date: string;
  image: string;
  bg: string;
}

export function PosterCard({ poster }: { poster: PosterData }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(0,0,0,0.15)",
        transform: isHovered ? "translateY(-8px) rotate(-1deg)" : "translateY(0) rotate(0deg)",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: poster.bg,
        }}
      />

      <Image
        src={poster.image}
        alt={poster.artist}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        style={{
          objectFit: "cover",
          opacity: 0.5,
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.5s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            opacity: 0.7,
            marginBottom: "4px",
          }}
        >
          {poster.date}
        </div>
        <h4
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {poster.artist}
        </h4>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
