export const SITE_CONFIG = {
  name: "The Outpost VFM",
  description: "Mountain Restaurant & Cabins in Mount Laguna",
  url: "https://theoutpostvfm.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cabins", label: "Cabins" },
  { href: "/live-music", label: "Live Music" },
  { href: "/menu", label: "Menu" },
  { href: "/giftcards", label: "Gift Cards" },
  { href: "/contact", label: "Contact" },
] as const;

export const DIETARY_TAGS = {
  vegetarian: { label: "Vegetarian", color: "green" },
  vegan: { label: "Vegan", color: "green" },
  "gluten-free": { label: "Gluten Free", color: "blue" },
  "dairy-free": { label: "Dairy Free", color: "purple" },
  "nut-free": { label: "Nut Free", color: "orange" },
} as const;
