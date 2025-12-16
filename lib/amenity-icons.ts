import {
  Wifi,
  Heater,
  Flame,
  Car,
  UtensilsCrossed,
  Refrigerator,
  Coffee,
  Microwave,
  Sun,
  ChefHat,
  Mountain,
  Moon,
  Bath,
  Telescope,
  Binoculars,
  WashingMachine,
  Dog,
  CigaretteOff,
  Tv,
  Snowflake,
  Circle,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps amenity icon keys (from cabins.json) to Lucide icon components
 * Centralized mapping used across all cabin listing and detail pages
 */
export const amenityIconMap: Record<string, LucideIcon> = {
  // Essentials
  wifi: Wifi,
  heating: Heater,
  fireplace: Flame,
  parking: Car,

  // Kitchen
  kitchen: UtensilsCrossed,
  fridge: Refrigerator,
  coffee: Coffee,
  microwave: Microwave,

  // Outdoors
  deck: Sun,
  grill: ChefHat,
  mountain: Mountain,

  // Entertainment & Features
  stargazing: Moon,
  "hot-tub": Bath,
  telescope: Telescope,
  binoculars: Binoculars,
  washer: WashingMachine,
  dryer: WashingMachine,

  // Policies
  paw: Dog,
  "pet-friendly": Dog,
  "no-smoking": CigaretteOff,
  tv: Tv,
  ac: Snowflake,
  cooling: Snowflake,

  // Additional mappings (existing in cabins.json)
  shower: Bath,
  linens: Flame,
  towels: Flame,
  "fire-pit": Flame,
};

/**
 * Get Lucide icon component for an amenity icon key
 * Returns fallback Circle icon if mapping not found
 */
export function getAmenityIcon(iconKey: string): LucideIcon {
  return amenityIconMap[iconKey] || Circle;
}
