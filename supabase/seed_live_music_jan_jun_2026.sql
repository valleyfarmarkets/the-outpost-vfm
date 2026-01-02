-- Live Music Events: January - June 2026
-- Run this after applying the ends_at migration

INSERT INTO public.live_music_events (title, slug, starts_at, ends_at, is_published) VALUES
-- January 2026 (PST, UTC-8)
('Midnight Ride', 'midnight-ride-2026-01-02', '2026-01-03T01:00:00Z', '2026-01-03T04:00:00Z', true),
('Al Barnes', 'al-barnes-2026-01-03', '2026-01-03T21:00:00Z', '2026-01-04T01:00:00Z', true),
('Bj Jezbera', 'bj-jezbera-2026-01-09', '2026-01-10T01:00:00Z', '2026-01-10T04:00:00Z', true),
('Kenna Rose', 'kenna-rose-2026-01-16', '2026-01-17T01:00:00Z', '2026-01-17T04:00:00Z', true),
('John Frazer', 'john-frazer-2026-01-17', '2026-01-17T21:00:00Z', '2026-01-18T01:00:00Z', true),
('Two the Moon Country', 'two-the-moon-country-2026-01-23', '2026-01-24T01:00:00Z', '2026-01-24T04:00:00Z', true),
('Jackson Wagner', 'jackson-wagner-2026-01-30', '2026-01-31T01:00:00Z', '2026-01-31T04:00:00Z', true),
-- February 2026 (PST, UTC-8)
('Kenna Rose', 'kenna-rose-2026-02-06', '2026-02-07T01:00:00Z', '2026-02-07T04:00:00Z', true),
('John Frazer', 'john-frazer-2026-02-07', '2026-02-07T21:00:00Z', '2026-02-08T01:00:00Z', true),
('Jackson Wagner', 'jackson-wagner-2026-02-13', '2026-02-14T01:00:00Z', '2026-02-14T04:00:00Z', true),
('Al Barnes', 'al-barnes-2026-02-20', '2026-02-21T01:00:00Z', '2026-02-21T04:00:00Z', true),
('Midnight Ride', 'midnight-ride-2026-02-21', '2026-02-21T21:00:00Z', '2026-02-22T01:00:00Z', true),
('Kyle Merrill', 'kyle-merrill-2026-02-27', '2026-02-28T01:00:00Z', '2026-02-28T04:00:00Z', true),
-- March 2026 (PST until 3/8, then PDT)
('Jackson Wagner', 'jackson-wagner-2026-03-06', '2026-03-07T01:00:00Z', '2026-03-07T04:00:00Z', true),
('Midnight Ride', 'midnight-ride-2026-03-07', '2026-03-07T21:00:00Z', '2026-03-08T01:00:00Z', true),
('John Frazer', 'john-frazer-2026-03-13', '2026-03-14T00:00:00Z', '2026-03-14T03:00:00Z', true),
('Kenna Rose', 'kenna-rose-2026-03-20', '2026-03-21T00:00:00Z', '2026-03-21T03:00:00Z', true),
('Al Barnes', 'al-barnes-2026-03-21', '2026-03-21T20:00:00Z', '2026-03-22T00:00:00Z', true),
('Two the Moon Country', 'two-the-moon-country-2026-03-27', '2026-03-28T00:00:00Z', '2026-03-28T03:00:00Z', true),
-- April 2026 (PDT, UTC-7)
('Jackson Wagner', 'jackson-wagner-2026-04-03', '2026-04-04T00:00:00Z', '2026-04-04T03:00:00Z', true),
('Midnight Ride', 'midnight-ride-2026-04-04', '2026-04-04T20:00:00Z', '2026-04-05T00:00:00Z', true),
('John Frazer', 'john-frazer-2026-04-10', '2026-04-11T00:00:00Z', '2026-04-11T03:00:00Z', true),
('Kenna Rose', 'kenna-rose-2026-04-17', '2026-04-18T00:00:00Z', '2026-04-18T03:00:00Z', true),
('Al Barnes', 'al-barnes-2026-04-18', '2026-04-18T20:00:00Z', '2026-04-19T00:00:00Z', true),
('Bj Jezbera', 'bj-jezbera-2026-04-24', '2026-04-25T00:00:00Z', '2026-04-25T03:00:00Z', true),
-- May 2026 (PDT, UTC-7)
('Jackson Wagner', 'jackson-wagner-2026-05-01', '2026-05-02T00:00:00Z', '2026-05-02T03:00:00Z', true),
('Midnight Ride', 'midnight-ride-2026-05-02', '2026-05-02T20:00:00Z', '2026-05-03T00:00:00Z', true),
('John Frazer', 'john-frazer-2026-05-08', '2026-05-09T00:00:00Z', '2026-05-09T03:00:00Z', true),
('Kenna Rose', 'kenna-rose-2026-05-15', '2026-05-16T00:00:00Z', '2026-05-16T03:00:00Z', true),
('Al Barnes', 'al-barnes-2026-05-16', '2026-05-16T20:00:00Z', '2026-05-17T00:00:00Z', true),
('Bj Jezbera', 'bj-jezbera-2026-05-22', '2026-05-23T00:00:00Z', '2026-05-23T03:00:00Z', true),
('Joe Rathburn', 'joe-rathburn-2026-05-29', '2026-05-30T00:00:00Z', '2026-05-30T03:00:00Z', true),
-- June 2026 (PDT, UTC-7)
('Joe Rathburn', 'joe-rathburn-2026-06-05', '2026-06-06T00:00:00Z', '2026-06-06T03:00:00Z', true),
('Midnight Ride', 'midnight-ride-2026-06-06', '2026-06-06T20:00:00Z', '2026-06-07T00:00:00Z', true),
('John Frazer', 'john-frazer-2026-06-12', '2026-06-13T00:00:00Z', '2026-06-13T03:00:00Z', true),
('Kenna Rose', 'kenna-rose-2026-06-19', '2026-06-20T00:00:00Z', '2026-06-20T03:00:00Z', true),
('Al Barnes', 'al-barnes-2026-06-20', '2026-06-20T20:00:00Z', '2026-06-21T00:00:00Z', true),
('Jackson Wagner', 'jackson-wagner-2026-06-26', '2026-06-27T00:00:00Z', '2026-06-27T03:00:00Z', true);
