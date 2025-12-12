export interface CabinAmenity {
  icon: string;
  label: string;
}

export interface Cabin {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: CabinAmenity[];
  priceRange: {
    min: number;
    max: number;
    unit: "night" | "week";
  };
  available: boolean;
}

export interface CabinData {
  cabins: Cabin[];
  bookingUrl: string;
  bookingPhone: string;
}
