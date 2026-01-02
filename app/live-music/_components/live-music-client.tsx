"use client";

import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";

export interface LiveMusicEvent {
  id: string;
  artist: string;
  date: string;
  startTime: string;
  endTime?: string;
}

interface Props {
  events: LiveMusicEvent[];
  nextEvent: LiveMusicEvent | null;
}

const artistGradients: Record<string, string> = {
  "Midnight Ride": "from-rose-900 via-red-800 to-amber-900",
  "Al Barnes": "from-emerald-900 via-teal-800 to-cyan-900",
  "Bj Jezbera": "from-violet-900 via-purple-800 to-fuchsia-900",
  "Kenna Rose": "from-pink-900 via-rose-800 to-red-900",
  "John Frazer": "from-blue-900 via-indigo-800 to-violet-900",
  "Two the Moon Country": "from-amber-900 via-orange-800 to-yellow-900",
  "Jackson Wagner": "from-slate-800 via-zinc-700 to-stone-800",
  "Kyle Merrill": "from-cyan-900 via-sky-800 to-blue-900",
  "Joe Rathburn": "from-orange-900 via-amber-800 to-yellow-900",
};

const getGradient = (artist: string) =>
  artistGradients[artist] || "from-gray-800 via-gray-700 to-gray-900";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T12:00:00");
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    dayNum: date.getDate(),
    month: date.toLocaleDateString("en-US", { month: "short" }),
    monthLong: date.toLocaleDateString("en-US", { month: "long" }),
    year: date.getFullYear(),
  };
};

export function LiveMusicClient({ events, nextEvent }: Props) {
  const months = useMemo(() => {
    const monthMap = new Map<string, { key: string; label: string }>();
    events.forEach((event) => {
      const date = new Date(event.date + "T12:00:00");
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!monthMap.has(key)) {
        monthMap.set(key, { key, label });
      }
    });
    return Array.from(monthMap.values());
  }, [events]);

  const [selectedMonth, setSelectedMonth] = useState(months[0]?.key || "");

  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      if (nextEvent && event.id === nextEvent.id) return false;
      const date = new Date(event.date + "T12:00:00");
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return key === selectedMonth;
    });
  }, [events, selectedMonth, nextEvent]);

  const nextEventDate = nextEvent ? formatDate(nextEvent.date) : null;

  return (
    <>
      {/* Next Event - Hero Card */}
      {nextEvent && nextEventDate && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">
              Next Show
            </span>
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGradient(nextEvent.artist)} p-8 md:p-12`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                    <div className="text-2xl font-bold">{nextEventDate.dayNum}</div>
                    <div className="text-xs uppercase tracking-wider opacity-80">
                      {nextEventDate.month}
                    </div>
                  </div>
                  <div className="text-sm opacity-80">
                    <div>{nextEventDate.day}</div>
                    <div>
                      {nextEvent.startTime}
                      {nextEvent.endTime ? ` - ${nextEvent.endTime}` : ""}
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">{nextEvent.artist}</h2>
                <p className="text-white/60">The Outpost, Mt. Laguna</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Month Navigation & Events List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-200">Upcoming Shows</h2>
        </div>

        {/* Month Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {months.map((month) => (
            <button
              key={month.key}
              onClick={() => setSelectedMonth(month.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedMonth === month.key
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="grid gap-3">
          {monthEvents.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <p>No additional shows this month.</p>
            </div>
          ) : (
            monthEvents.map((event) => {
              const date = formatDate(event.date);
              return (
                <div
                  key={event.id}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-800/50 hover:border-neutral-700 transition-all cursor-pointer"
                >
                  {/* Date Block */}
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="text-xs text-neutral-500 uppercase">{date.day}</div>
                    <div className="text-2xl font-bold text-neutral-200">{date.dayNum}</div>
                  </div>

                  {/* Color Accent */}
                  <div
                    className={`w-1 h-12 rounded-full bg-gradient-to-b ${getGradient(event.artist)}`}
                  ></div>

                  {/* Event Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-neutral-100 group-hover:text-white transition-colors truncate">
                      {event.artist}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {event.startTime}
                      {event.endTime ? ` - ${event.endTime}` : ""}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 text-neutral-600 group-hover:text-neutral-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
