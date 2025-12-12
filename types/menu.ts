export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "nut-free";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  dietaryTags?: DietaryTag[];
  featured?: boolean;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuData {
  categories: MenuCategory[];
  lastUpdated: string;
}
