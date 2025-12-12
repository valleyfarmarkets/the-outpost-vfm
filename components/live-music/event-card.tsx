import { Calendar, Clock, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { MusicEvent } from "@/types/events";

interface EventCardProps {
  event: MusicEvent;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const dayOfWeek = eventDate.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = formatDate(event.date);

  return (
    <Card hover>
      <div>
        {event.featured && (
          <Badge variant="purple" className="mb-2">
            Featured Event
          </Badge>
        )}

        <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
        <div className="mt-1 flex items-center text-lg text-brand-primary">
          <Music className="mr-2 h-5 w-5" />
          <span className="font-semibold">{event.artist}</span>
        </div>

        {event.genre && (
          <p className="mt-1 text-sm text-gray-600">{event.genre}</p>
        )}

        {event.description && (
          <p className="mt-4 text-sm text-gray-600">{event.description}</p>
        )}

        <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="mr-2 h-4 w-4 text-brand-primary" />
            <span>
              {dayOfWeek}, {formattedDate}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="mr-2 h-4 w-4 text-brand-primary" />
            <span>
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
