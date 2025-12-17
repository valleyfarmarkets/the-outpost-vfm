"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Instagram,
  Music,
} from "lucide-react";
import eventsData from "@/data/events.json";
import type { EventData, MusicEvent } from "@/types/events";

const colors = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
  goldenAmber: "#DE9A2E",
  brightGold: "#F9AC30",
  cream: "#FAF8F5",
  warmWhite: "#FFFDF9",
  textMuted: "#6B6966",
  lightGray: "#E8E4DE",
};

const defaultPosters = [
  {
    id: 1,
    artist: "Sierra Gold",
    date: "Dec 13, 2024",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    bg: colors.goldenAmber,
  },
  {
    id: 2,
    artist: "The Timber Wolves",
    date: "Dec 6, 2024",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
    bg: colors.deepRed,
  },
  {
    id: 3,
    artist: "Wildflower Revival",
    date: "Nov 29, 2024",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80",
    bg: "#4A7C59",
  },
  {
    id: 4,
    artist: "Mountain Standard",
    date: "Nov 22, 2024",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80",
    bg: colors.burntOrange,
  },
  {
    id: 5,
    artist: "Copper Creek Band",
    date: "Nov 15, 2024",
    image:
      "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?w=400&q=80",
    bg: "#8B4513",
  },
  {
    id: 6,
    artist: "The Starlight Sessions",
    date: "Nov 8, 2024",
    image:
      "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=400&q=80",
    bg: "#2C3E50",
  },
];

function SoundWave({ color = colors.brightGold }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "24px" }}>
      {[0.6, 1, 0.4, 0.8, 0.5, 0.9, 0.3].map((height, i) => (
        <div
          key={i}
          style={{
            width: "4px",
            height: `${height * 100}%`,
            background: color,
            borderRadius: "2px",
            animation: `pulse 1s ease-in-out ${i * 0.1}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0% { transform: scaleY(0.5); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

function FeaturedShowCard({ show }: { show: MusicEvent }) {
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

function UpcomingShowCard({ show }: { show: MusicEvent }) {
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

function PosterCard({
  poster,
}: {
  poster: { id: number; artist: string; date: string; image: string; bg: string };
}) {
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

export default function LiveMusicPage() {
  const eventData: EventData = eventsData;
  const today = new Date();
  const upcoming = (eventData.upcoming ?? []).filter(
    (event) => new Date(event.date) >= today
  );
  const sortedUpcoming = [...upcoming].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const featuredShow = sortedUpcoming.find((e) => e.featured) ?? sortedUpcoming[0];
  const otherShows = sortedUpcoming.filter((e) => e.id !== featuredShow?.id);
  const posters =
    eventData.past && eventData.past.length > 0
      ? eventData.past.map((p, idx) => ({
          id: idx,
          artist: p.artist,
          date: new Date(p.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          image: p.image ?? "",
          bg: colors.deepRed,
        }))
      : defaultPosters;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.charcoal,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "80px 24px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.deepRed}30 0%, transparent 70%)`,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "20%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.brightGold}20 0%, transparent 70%)`,
            animation: "pulse 5s ease-in-out infinite",
          }}
        />

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
          }
        `}</style>

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <h1
            className="font-heading text-[clamp(48px,10vw,80px)] font-bold leading-none"
            style={{
              fontFamily: "var(--font-kleader-sans-rough), 'Playfair Display', serif",
              color: "#fff",
              margin: "32px 0 20px 0",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            Live Music
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "500px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Local artists, mountain vibes, and good times every Friday from 5-8 PM.
            Grab a drink, pull up a chair, and let the music move you.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fff",
                fontSize: "15px",
              }}
            >
              <Calendar className="h-4 w-4" /> Fridays
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fff",
                fontSize: "15px",
              }}
            >
              <Clock className="h-4 w-4" /> 5:00 PM - 8:00 PM
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fff",
                fontSize: "15px",
              }}
            >
              <MapPin className="h-4 w-4" /> The Outpost, Mt. Laguna
            </div>
          </div>
        </div>
      </section>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <section style={{ marginBottom: "80px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}
          >
            <h2
              className="font-serif"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "32px",
                fontWeight: 600,
                color: "#fff",
                margin: 0,
              }}
            >
              Upcoming Shows
            </h2>
            <SoundWave color={colors.burntOrange} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "32px",
            }}
          >
            <div style={{ gridColumn: "span 1" }}>
              {featuredShow ? (
                <FeaturedShowCard show={featuredShow} />
              ) : (
                <div
                  style={{
                    height: "100%",
                    minHeight: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff",
                  }}
                >
                  No upcoming shows yet.
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: colors.brightGold,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  margin: "0 0 8px 0",
                }}
              >
                Coming Soon
              </h3>
              {otherShows.length > 0 ? (
                otherShows.map((show) => (
                  <UpcomingShowCard key={show.id} show={show} />
                ))
              ) : (
                <div
                  style={{
                    background: colors.warmWhite,
                    borderRadius: "16px",
                    padding: "20px",
                    color: colors.charcoal,
                    border: `1px solid ${colors.lightGray}`,
                  }}
                >
                  Check back soon for more dates.
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}
          >
            <div>
              <h2
                className="font-serif"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "#fff",
                  margin: "0 0 8px 0",
                }}
              >
                Past Shows
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                }}
              >
                A look back at the artists who have graced our stage
              </p>
            </div>
            <button
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            {posters.map((poster) => (
              <PosterCard key={poster.id} poster={poster} />
            ))}
          </div>
        </section>

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
            <a
              href="mailto:music@theoutpostvfm.com"
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
              }}
            >
              Book a Show
            </a>
          </div>
        </section>
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <a
            href="https://www.instagram.com/valleyfarmoutpost"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            style={{ color: "rgba(255,255,255,0.6)" }}
            aria-label="Spotify"
          >
            <Music className="h-5 w-5" />
          </a>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            margin: 0,
          }}
        >
          The Outpost by Valley Farm Market · Mt. Laguna, CA
        </p>
      </footer>
    </div>
  );
}
