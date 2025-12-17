import { getSupabaseServerClient } from './server-client';
import type { ReservationResponse } from '@/lib/booking/api-client';
import type { GuestDetails } from '@/types/booking';
import { format } from 'date-fns';

export interface BookingRecord {
  id: string;
  guesty_reservation_id: string;
  guesty_confirmation_code: string;
  cabin_id: string;
  cabin_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_notes: string | null;
  adults: number;
  children: number;
  base_price_cents: number;
  cleaning_fee_cents: number;
  tax_amount_cents: number;
  total_price_cents: number;
  currency: string;
  payment_status: string;
  status: string;
  created_at: string;
}

export interface CreatePendingBookingParams {
  guestDetails: GuestDetails;
  quoteId: string;
  guestyListingId: string; // Guesty listing ID (e.g., "644c4e9987a657002fada980")
  cabinId: string; // Internal slug (e.g., "hunters-lair")
  cabinName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  estimatedTotal: number;
  stripeToken: string;
  ipAddress?: string;
  userAgent?: string;
  id?: string; // Optional custom ID for idempotency
}


/**
 * PENDING STATE PATTERN: Create booking record BEFORE calling Guesty
 * This ensures we have a record of every booking attempt, preventing split-brain
 * scenarios where payment succeeds but we fail to save the booking.
 */
export async function createPendingBooking(
  params: CreatePendingBookingParams
): Promise<BookingRecord> {
  const supabase = getSupabaseServerClient();

  const bookingData = {
    // Use provided ID or let database generate one
    ...(params.id && { id: params.id }),
    
    // NULL until Guesty confirms (allows concurrent pending bookings)
    guesty_reservation_id: null,

    guesty_confirmation_code: null,
    guesty_listing_id: params.guestyListingId, // Guesty listing ID for API calls
    guesty_quote_id: params.quoteId,

    cabin_id: params.cabinId, // Internal slug for reference
    cabin_name: params.cabinName,

    // Bulletproof date handling using date-fns to avoid timezone issues
    check_in: format(new Date(params.checkIn), 'yyyy-MM-dd'),
    check_out: format(new Date(params.checkOut), 'yyyy-MM-dd'),
    nights: params.nights,

    guest_first_name: params.guestDetails.firstName,
    guest_last_name: params.guestDetails.lastName,
    guest_email: params.guestDetails.email,
    guest_phone: params.guestDetails.phone,
    guest_notes: params.guestDetails.notes || null,

    adults: params.adults,
    children: params.children,

    // Use estimated total from quote (will be updated after Guesty confirms)
    base_price_cents: 0, // Will be updated
    cleaning_fee_cents: 0, // Will be updated
    tax_amount_cents: 0, // Will be updated
    total_price_cents: Math.round(params.estimatedTotal * 100),
    currency: 'USD',

    payment_status: 'pending',
    stripe_payment_token: params.stripeToken,
    status: 'pending',

    ip_address: params.ipAddress || null,
    user_agent: params.userAgent || null,
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to create pending booking:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  return data as BookingRecord;
}

/**
 * Update booking with confirmed details from Guesty
 */
export async function updateBookingWithConfirmation(
  bookingId: string,
  reservationResponse: ReservationResponse
): Promise<void> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from('bookings')
    .update({
      guesty_reservation_id: reservationResponse.reservationId,
      guesty_confirmation_code: reservationResponse.confirmationCode,
      base_price_cents: Math.round(reservationResponse.pricing.basePrice * 100),
      cleaning_fee_cents: Math.round(reservationResponse.pricing.cleaningFee * 100),
      tax_amount_cents: Math.round(reservationResponse.pricing.taxAmount * 100),
      total_price_cents: Math.round(reservationResponse.pricing.total * 100),
      currency: reservationResponse.pricing.currency,
      // Normalize payment status to lowercase (Guesty may return 'Paid' or 'paid')
      payment_status: reservationResponse.paymentStatus.toLowerCase(),
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) {
    console.error('[Supabase] Failed to update booking:', error);
    throw new Error(`Database error: ${error.message}`);
  }
}

/**
 * Mark booking as failed if Guesty call fails
 */
export async function markBookingFailed(
  bookingId: string,
  errorMessage: string
): Promise<void> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      payment_status: 'failed',
      guest_notes: errorMessage, // Store error in notes for debugging
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) {
    console.error('[Supabase] Failed to mark booking as failed:', error);
  }
}

export async function getBookingByConfirmation(
  confirmationCode: string
): Promise<BookingRecord | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('guesty_confirmation_code', confirmationCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Database error: ${error.message}`);
  }

  return data as BookingRecord;
}

export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Database error: ${error.message}`);
  }

  return data as BookingRecord;
}

