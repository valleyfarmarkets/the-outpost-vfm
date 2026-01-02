-- Add ends_at column to live_music_events table
ALTER TABLE public.live_music_events
ADD COLUMN ends_at timestamptz;
