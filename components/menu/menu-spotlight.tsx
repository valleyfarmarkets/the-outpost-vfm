import Link from "next/link";
import { Flame, Clock3, Music, ArrowRight, ExternalLink } from "lucide-react";
import type { CSSProperties } from "react";
import siteInfo from "@/data/site-info.json";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const palette = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
  goldenAmber: "#DE9A2E",
  brightGold: "#F9AC30",
  cream: "#FAF8F5",
  warmWhite: "#FFFDF9",
  textMuted: "#6B6966",
};

const menuHighlights = [
  {
    id: 1,
    name: "Big Laguna BBQ Board",
    description:
      "A shareable spread of smoked meats, pickles, jalapeños, onions & all the fixings. Perfect for the table.",
    tag: "Weekend Special",
    tagColor: palette.deepRed,
    imageUrl: "/images/food/big_laguna_bbq_board.jpg",
  },
  {
    id: 2,
    name: "El Barracho Pizza",
    description:
      "Wood-fired pizza loaded with smoked meats, fresh toppings & melted cheese. A mountain favorite.",
    tag: "Fan Favorite",
    tagColor: palette.burntOrange,
    imageUrl: "/images/food/el_barracho.jpg",
  },
  {
    id: 3,
    name: "Pulled Pork Sandwich",
    description:
      "Slow-smoked pulled pork piled high on a toasted bun with house slaw & tangy BBQ sauce.",
    tag: "Served Daily",
    tagColor: palette.goldenAmber,
    imageUrl: "/images/food/pulled_pork.jpg",
  },
];

function MenuCard({
  item,
}: {
  item: (typeof menuHighlights)[number];
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
          style={{ backgroundColor: item.tagColor }}
        >
          {item.tag}
        </span>
      </div>

      <div className="space-y-2 px-5 py-4">
        <h3 className="text-lg font-semibold text-[var(--menu-charcoal)]">
          {item.name}
        </h3>
        <p className="text-sm leading-6 text-[var(--menu-text-muted)]">
          {item.description}
        </p>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition duration-300 group-hover:scale-x-100"
        style={{
          backgroundImage: `linear-gradient(90deg, ${item.tagColor} 0%, ${palette.brightGold} 100%)`,
        }}
      />
    </article>
  );
}

export function MenuSpotlight() {
  return (
    <Section
      className="relative overflow-hidden bg-[var(--menu-cream)]"
      style={
        {
          "--menu-charcoal": palette.charcoal,
          "--menu-deepRed": palette.deepRed,
          "--menu-burntOrange": palette.burntOrange,
          "--menu-goldenAmber": palette.goldenAmber,
          "--menu-brightGold": palette.brightGold,
          "--menu-cream": palette.cream,
          "--menu-warmWhite": palette.warmWhite,
          "--menu-text-muted": palette.textMuted,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.deepRed}15 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.brightGold}15 0%, transparent 70%)`,
        }}
      />

      <Container className="relative">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--menu-warmWhite)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--menu-charcoal)] shadow-sm">
              <Flame className="h-4 w-4" />
              The Outpost Restaurant
            </div>
            <h1 className="text-3xl font-serif text-[var(--menu-charcoal)] sm:text-4xl">
              Mountain Comfort,{" "}
              <span className="italic text-[var(--menu-burntOrange)]">
                Served Fresh
              </span>
            </h1>
            <p className="text-base leading-7 text-[var(--menu-text-muted)] sm:text-lg">
              Steps away from your cabin, The Outpost serves up smoked BBQ,
              burgers, fresh salads, and craft drinks. Fuel up before the trail
              or wind down with live music and mountain views.
            </p>
          </div>

          <div className="hidden sm:block min-w-[220px] rounded-2xl bg-[var(--menu-charcoal)] p-5 text-white shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-[var(--menu-brightGold)]">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.08em]">
                Hours
              </span>
            </div>
            <ul className="space-y-1 text-sm leading-6">
              {siteInfo.hours
                .map((day) => (
                  <li key={day.day}>
                    <span className="font-semibold">{day.day}:</span>{" "}
                    {day.open} - {day.close}
                  </li>
                ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 border-t border-white/15 pt-3 text-[var(--menu-brightGold)]">
              <Music className="h-4 w-4" />
              <span className="text-xs font-semibold">
                Live music Fri & Sat
              </span>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg sm:px-6"
          style={{
            background: `linear-gradient(135deg, ${palette.deepRed} 0%, ${palette.burntOrange} 100%)`,
          }}
        >
          <span>Smoked BBQ available Saturdays & Sundays only</span>
          <span className="hidden sm:inline">— Brisket, ribs, pulled pork & more</span>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuHighlights.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://www.toasttab.com/the-outpost"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition",
              "bg-[var(--menu-charcoal)] hover:-translate-y-0.5 hover:shadow-2xl",
              "hover:bg-gradient-to-r hover:from-[var(--menu-deepRed)] hover:to-[var(--menu-burntOrange)]"
            )}
          >
            Order Online
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-[var(--menu-charcoal)] px-6 py-3 text-sm font-semibold text-[var(--menu-charcoal)] transition hover:-translate-y-0.5 hover:bg-[var(--menu-warmWhite)] hover:shadow-lg"
          >
            Explore Full Menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
