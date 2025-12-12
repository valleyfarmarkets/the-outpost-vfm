/**
 * Guesty API TypeScript Type Definitions
 * Documentation: https://booking-api-docs.guesty.com/
 */

// Token Management Types
export interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp
  renewalCount: number;
  renewalResetTime: number; // Unix timestamp
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
  scope: string;
}

// Search Request/Response Types
export interface SearchRequest {
  listingId: string;
  checkIn: string; // ISO 8601 date-time
  checkOut: string; // ISO 8601 date-time
  guests: {
    adults: number;
    children?: number;
  };
}

export interface SearchResponse {
  available: boolean;
  listing: {
    id: string;
    name: string;
    capacity: number;
  };
  blockedDates: string[]; // Array of ISO date strings
  minimumStay: number; // nights
  maximumStay: number; // nights
}

// Quote Request/Response Types
export interface QuoteRequest {
  listingId: string;
  checkIn: string; // ISO 8601 date-time
  checkOut: string; // ISO 8601 date-time
  numberOfGuests: number;
  ratePlanId?: string;
}

export interface RatePlan {
  id: string;
  name: string;
  cancellationPolicy: string;
  description?: string;
}

export interface PricingBreakdown {
  basePrice: number;
  cleaningFee: number;
  taxAmount: number;
  total: number;
  currency: string;
  nightlyRates: Array<{
    date: string;
    price: number;
  }>;
}

export interface QuoteResponse {
  quoteId: string;
  expiresAt: string; // ISO 8601 date-time
  pricing: PricingBreakdown;
  ratePlan: RatePlan;
  terms: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
}

export interface GuestyMoney {
  hostPayout?: number;
  cleaningFee?: number;
  hostServiceFee?: number;
  totalPrice?: number;
  currency?: string;
  nightlyRates?: Array<{
    date: string;
    price: number;
  }>;
}

export interface GuestyQuoteApiResponse {
  quoteId?: string;
  _id?: string;
  expiresAt?: string;
  validUntil?: string;
  money?: GuestyMoney;
  nightlyRates?: GuestyMoney['nightlyRates'];
  ratePlan?: {
    _id?: string;
    title?: string;
    cancellationPolicy?: string;
  };
  terms?: string;
}

export interface GuestyReservationApiResponse {
  _id?: string;
  reservationId?: string;
  confirmationCode?: string;
  confirmationId?: string;
  status?: string;
  listing?: {
    _id?: string;
    title?: string;
  };
  listingId?: string;
  checkIn?: string;
  checkOut?: string;
  checkInDateLocalized?: string;
  checkOutDateLocalized?: string;
  money?: GuestyMoney;
  nightlyRates?: GuestyMoney['nightlyRates'];
  paymentStatus?: string;
}

export interface GuestySearchResult {
  _id: string;
  available?: boolean;
  blockedDates?: string[];
  minNights?: number;
  maxNights?: number;
  title?: string;
  nickname?: string;
  accommodates?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  address?: {
    full?: string;
  };
}

export interface GuestySearchApiResponse {
  results?: GuestySearchResult[];
}

// Reservation Request/Response Types
export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface ReservationRequest {
  quoteId: string;
  guest: GuestDetails;
  paymentToken: string; // Stripe token or payment method ID
  notes?: string;
}

export interface ReservationResponse {
  reservationId: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending' | 'failed';
  guest: GuestDetails;
  listing: {
    id: string;
    name: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
  };
  pricing: PricingBreakdown;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

// Guesty API Error Response
export interface GuestyError {
  error: string;
  message: string;
  statusCode: number;
}
