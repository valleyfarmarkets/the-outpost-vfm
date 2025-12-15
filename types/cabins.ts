export interface CabinAmenity {
  icon: string;
  label: string;
  description?: string;
  category?: string;
}

// Enhanced cabin detail types
export interface BedDetail {
  type: "King" | "Queen" | "Full" | "Twin" | "Bunk" | "Sofa Bed";
  count: number;
}

export interface BedroomInfo {
  id: string;
  name: string;
  beds: BedDetail[];
  features: string[];
}

export interface AmenityCategorized {
  category: "Essentials" | "Kitchen" | "Outdoors" | "Entertainment" | "Features";
  items: CabinAmenity[];
}

export interface HouseRule {
  icon: string;
  label: string;
  description?: string;
}

export interface CancellationPolicy {
  type: "Flexible" | "Moderate" | "Strict";
  rules: {
    timeframe: string;
    refundPercentage: number;
  }[];
  additionalNotes?: string;
}

export interface CabinReview {
  id: string;
  author: {
    name: string;
    location: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
  stayDate?: string;
  verified?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: { [key: number]: number };
}

export interface CabinHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface CabinHost {
  name: string;
  initials: string;
  since?: string;
}

export interface Cabin {
  id: string;
  name: string;
  guestyListingId: string;
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
  // Enhanced detail page fields
  bedroomDetails?: BedroomInfo[];
  amenitiesCategorized?: AmenityCategorized[];
  houseRules?: HouseRule[];
  cancellationPolicy?: CancellationPolicy;
  reviewStats?: ReviewStats;
  highlights?: CabinHighlight[];
  host?: CabinHost;
  securityDeposit?: number;
  cleaningFee?: number;
  serviceFee?: number;
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
