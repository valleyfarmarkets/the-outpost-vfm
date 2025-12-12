export interface MusicEvent {
  id: string;
  title: string;
  artist: string;
  date: string; // ISO format
  startTime: string; // HH:MM format
  endTime?: string;
  description?: string;
  image?: string;
  genre?: string;
  featured?: boolean;
}

export interface EventData {
  upcoming: MusicEvent[];
  past?: MusicEvent[];
}
