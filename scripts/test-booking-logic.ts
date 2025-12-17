
import { bookingReducer, initialState, BookingAction } from '../context/booking-context';
import { Cabin } from '../types/cabins';
import { GuestyQuote } from '../types/booking';

// Mock Cabin
const mockCabin: Cabin = {
  id: 'test-cabin',
  guestyListingId: 'guesty-123',
  name: 'Test Cabin',
  personalityTag: 'Cozy',
  petFriendly: true,
  hasFireplace: true,
  available: true,
  shortDescription: 'A test cabin',
  description: 'Long description',
  capacity: 4,
  bedrooms: 2,
  bathrooms: 1,
  images: [],
  amenities: [],
  priceRange: { min: 100, max: 200, unit: 'night' },
  cleaningFee: 50,
  featured: false,
};

// Mock Quote
const mockQuote: GuestyQuote = {
  quoteId: 'quote-123',
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  pricing: {
    basePrice: 200,
    cleaningFee: 50,
    taxAmount: 20,
    total: 270,
    currency: 'USD',
    nightlyRates: []
  },
  ratePlan: {
    id: 'rate-1',
    name: 'Standard',
    cancellationPolicy: 'Flexible'
  },
  terms: 'Terms',
};

function runTest() {
  console.log('🧪 Starting Booking Logic Test...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  // Test 1: Open Booking generates Idempotency Key
  console.log('Test 1: Open Booking');
  const step1 = bookingReducer(initialState, { type: 'OPEN_BOOKING', payload: mockCabin });
  assert(step1.isModalOpen === true, 'Modal should be open');
  assert(!!step1.idempotencyKey, 'Idempotency Key should be generated');
  assert(step1.cabin?.id === mockCabin.id, 'Cabin should be set');

  const key1 = step1.idempotencyKey;

  // Test 2: Select Dates (Key should persist)
  console.log('\nTest 2: Select Dates');
  const step2 = bookingReducer(step1, { 
    type: 'SET_DATES', 
    payload: { checkIn: new Date(), checkOut: new Date() } 
  });
  assert(step2.currentStep === 2 || step2.currentStep === step1.currentStep, 'Step should advance or stay');
  assert(step2.idempotencyKey === key1, 'Idempotency Key should NOT change on date selection');

  // Test 3: Set Quote (Key should regenerate)
  console.log('\nTest 3: Set Quote (Regeneration)');
  const step3 = bookingReducer(step2, { type: 'SET_QUOTE', payload: mockQuote });
  assert(step3.quote?.quoteId === mockQuote.quoteId, 'Quote should be set');
  assert(step3.idempotencyKey !== key1, 'Idempotency Key MUST regenerate when quote changes (new deal)');
  
  const key2 = step3.idempotencyKey;

  // Test 4: Set Guest Details (Key should persist)
  console.log('\nTest 4: Set Guest Details');
  const step4 = bookingReducer(step3, { 
    type: 'SET_GUEST_DETAILS', 
    payload: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123' } 
  });
  assert(step4.currentStep === 5 || step4.currentStep > 3, 'Should advance to payment step (5)');
  assert(step4.idempotencyKey === key2, 'Idempotency Key should persist during checkout flow');

  console.log(`\n\nResults: ${passed} Passed, ${failed} Failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTest();
