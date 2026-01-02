import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Instagram,
  Music,
} from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import type { MusicEvent } from "@/types/events";

import { FeaturedShowCard } from "./_components/featured-show-card";
import { UpcomingShowCard } from "./_components/upcoming-show-card";
import { PosterCard, type PosterData } from "./_components/poster-card";
import { SoundWave } from "./_components/sound-wave";
import { PerformerSection } from "./_components/performer-section";

export const dynamic = "force-dynamic";

const VENUE_TIMEZONE = "America/Los_Angeles";

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

const defaultPosters: PosterData[] = [
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

interface LiveMusicEventDB {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  ends_at: string | null;
  description: string | null;
  is_published: boolean;
}

function transformEvent(dbEvent: LiveMusicEventDB): MusicEvent {
  const startsAt = new Date(dbEvent.starts_at);
  const endsAt = dbEvent.ends_at ? new Date(dbEvent.ends_at) : null;

  return {
    id: dbEvent.slug,
    title: dbEvent.title,
    artist: dbEvent.title,
    date: formatInTimeZone(startsAt, VENUE_TIMEZONE, "yyyy-MM-dd"),
    startTime: formatInTimeZone(startsAt, VENUE_TIMEZONE, "h:mm a"),
    endTime: endsAt ? formatInTimeZone(endsAt, VENUE_TIMEZONE, "h:mm a") : undefined,
    description: dbEvent.description ?? undefined,
  };
}

export default async function LiveMusicPage() {
  const supabase = await createSupabaseServerClient();

  const { data: dbEvents } = await supabase
    .from("live_music_events")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const upcoming: MusicEvent[] = (dbEvents || []).map(transformEvent);
  const featuredShow = upcoming[0];
  const otherShows = upcoming.slice(1);
  const posters = defaultPosters;

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
          padding: "160px 24px 80px 24px",
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

        <PerformerSection />
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
