'use client';

import { Clock, AlertTriangle } from 'lucide-react';
import { useQuoteTimer } from '@/hooks/use-quote-timer';
import { cn } from '@/lib/utils';

/**
 * Quote Expiration Timer
 *
 * Displays countdown timer for quote expiration
 * Shows warning at 2 minutes remaining
 */

interface QuoteExpirationTimerProps {
  expiresAt: Date | null;
  onRefresh?: () => void;
}

export function QuoteExpirationTimer({ expiresAt, onRefresh }: QuoteExpirationTimerProps) {
  const { formattedTime, isExpired, isWarning } = useQuoteTimer(expiresAt);

  if (isExpired) {
    return (
      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Quote Expired</p>
            <p className="text-sm text-red-800 mt-1">
              This quote has expired. Please refresh to get updated pricing.
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
              >
                Refresh Quote
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('p-3 rounded-lg border flex items-center gap-2', {
        'bg-yellow-50 border-yellow-300': isWarning,
        'bg-gray-50 border-gray-200': !isWarning,
      })}
    >
      <Clock className={cn('h-4 w-4', isWarning ? 'text-yellow-600' : 'text-gray-500')} />
      <div className="flex-1">
        <p className={cn('text-sm font-medium', isWarning ? 'text-yellow-900' : 'text-gray-700')}>
          {isWarning ? 'Quote expiring soon' : 'Quote valid for'}
        </p>
        <p
          className={cn(
            'text-lg font-bold tabular-nums',
            isWarning ? 'text-yellow-900' : 'text-gray-900'
          )}
        >
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
