'use client';

import { formatPrice } from '@/lib/utils';
import type { PriceBreakdown } from '@/types/booking';

/**
 * Pricing Breakdown
 *
 * Displays itemized pricing from quote
 */

interface PricingBreakdownProps {
  pricing: PriceBreakdown;
  nights: number;
}

export function PricingBreakdown({ pricing, nights }: PricingBreakdownProps) {
  return (
    <div className="space-y-3">
      {/* Nightly rates */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Nightly Rate × {nights} night{nights !== 1 ? 's' : ''}
        </span>
        <span className="font-medium">{formatPrice(pricing.basePrice)}</span>
      </div>

      {/* Cleaning fee */}
      {pricing.cleaningFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cleaning Fee</span>
          <span className="font-medium">{formatPrice(pricing.cleaningFee)}</span>
        </div>
      )}

      {/* Taxes */}
      {pricing.taxAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & Fees</span>
          <span className="font-medium">{formatPrice(pricing.taxAmount)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t pt-3">
        <div className="flex justify-between">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-brand-primary">
            {formatPrice(pricing.total)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Charged in {pricing.currency}</p>
      </div>
    </div>
  );
}
