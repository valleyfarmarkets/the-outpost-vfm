import Link from "next/link";
import { Music, ChevronRight } from "lucide-react";

export interface LiveMusicOverlayProps {
  artist: string;
  date: string;
  startTime: string;
  endTime?: string;
}

export function LiveMusicOverlay({ artist, date, startTime, endTime }: LiveMusicOverlayProps) {
  const eventDate = new Date(date + "T12:00:00");
  const today = new Date();
  const isToday =
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate();

  const timeDisplay = endTime ? `${startTime} - ${endTime}` : startTime;

  return (
    <Link
      href="/live-music"
      className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-3 md:p-4 hover:bg-black/70 hover:border-white/20 transition-all group z-20"
    >
      <div className="flex items-center gap-3">
        {/* Icon - hidden on small mobile */}
        <div className="hidden sm:flex flex-shrink-0 bg-amber-600 rounded-lg w-12 h-12 items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>

        {/* Pulse indicator - mobile only */}
        <div className="sm:hidden flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </div>

        {/* Event Info */}
        <div className="min-w-0 flex-grow">
          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                {isToday ? "Live Music Today" : "Upcoming Live Music"}
              </span>
            </div>
            <h4 className="font-semibold text-white text-lg group-hover:text-amber-100 transition-colors">
              {artist}
            </h4>
            <p className="text-sm text-white/60">{timeDisplay} · The Outpost</p>
          </div>

          {/* Mobile */}
          <div className="sm:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase">
                {isToday ? "Today" : "Upcoming"}
              </span>
              <span className="text-white/30">·</span>
              <span className="font-semibold text-white">{artist}</span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">{timeDisplay}</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="hidden md:inline text-sm text-white/50 group-hover:text-white/70 transition-colors">
            View Schedule
          </span>
          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
