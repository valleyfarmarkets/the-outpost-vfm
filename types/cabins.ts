export interface CabinAmenity {
  icon: string;
  label: string;
  description?: string;
  category?: string;
}

export interface Cabin {
  id: string;
  name: string;
  personalityTag: string;
  description: string;
  shortDescription: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  petFriendly: boolean;
  hasFireplace: boolean;
  featured?: boolean;
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

export interface FAQ {
  question: string;
  answer: string;
  category: "policies" | "amenities" | "booking" | "location";
  order: number;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
  description: string;
  icon: string;
  type: string;
}

export interface SeasonalHighlight {
  season: string;
  months: string;
  description: string;
  icon: string;
  temperature: string;
}

export interface Review {
  author: string;
  location: string;
  rating: number;
  snippet: string;
  date: string;
  cabin: string;
}

export interface TrustSignal {
  icon: string;
  label: string;
  description: string;
}

export interface LocationData {
  location: {
    headline: string;
    description: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    mapEmbedUrl: string;
  };
  nearbyAttractions: NearbyAttraction[];
  seasonalHighlights: SeasonalHighlight[];
}

export interface ReviewsData {
  reviewsSnippet: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
      [key: string]: number;
    };
    highlights: Review[];
  };
  trustSignals: TrustSignal[];
}
