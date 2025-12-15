'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Mail, Calendar, Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDisplayDate } from '@/lib/booking/date-utils';
import { formatPrice } from '@/lib/utils';
import type { GuestCount } from '@/types/booking';

/**
 * Booking Success Component
 *
 * Displays booking confirmation with confetti animation
 */

interface BookingSuccessProps {
  confirmationCode: string;
  cabinName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  guests: GuestCount;
  total: number;
  currency: string;
  onClose: () => void;
}

export function BookingSuccess({
  confirmationCode,
  cabinName,
  guestEmail,
  checkIn,
  checkOut,
  guests,
  total,
  currency,
  onClose,
}: BookingSuccessProps) {
  // Confetti animation on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D64439', '#D9A441'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D64439', '#D9A441'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleCopyConfirmation = () => {
    navigator.clipboard.writeText(confirmationCode);
  };

  return (
    <div className="text-center space-y-6 py-8">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
      </div>

      {/* Success message */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your reservation at {cabinName} has been confirmed.
        </p>
      </div>

      {/* Confirmation code */}
      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
        <p className="text-sm text-green-800 font-medium mb-1">Confirmation Code</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold text-green-900 tracking-wider">{confirmationCode}</p>
          <button
            onClick={handleCopyConfirmation}
            className="p-2 hover:bg-green-100 rounded transition-colors"
            title="Copy confirmation code"
          >
            <Copy className="h-5 w-5 text-green-700" />
          </button>
        </div>
      </div>

      {/* Email confirmation notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-left">
        <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">Confirmation Email Sent</p>
          <p className="text-sm text-blue-800 mt-1">
            A confirmation email has been sent to <strong>{guestEmail}</strong> with all your
            booking details.
          </p>
        </div>
      </div>

      {/* Booking details */}
      <div className="p-6 border rounded-lg text-left space-y-4">
        <h3 className="font-semibold text-gray-900">Booking Details</h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-brand-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Check-in / Check-out</p>
              <p className="text-gray-600">
                {formatDisplayDate(checkIn)} → {formatDisplayDate(checkOut)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-brand-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Guests</p>
              <p className="text-gray-600">
                {guests.adults + guests.children} guest{guests.adults + guests.children !== 1 ? 's' : ''}{' '}
                ({guests.adults} adult{guests.adults !== 1 ? 's' : ''}
                {guests.children > 0 && `, ${guests.children} child${guests.children !== 1 ? 'ren' : ''}`})
              </p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Total Paid</span>
              <span className="font-bold text-brand-primary text-lg">
                {formatPrice(total)} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="p-4 bg-gray-50 rounded-lg text-left">
        <h4 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h4>
        <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
          <li>Check your email for detailed confirmation and directions</li>
          <li>You can contact us if you need to modify your reservation</li>
          <li>We&apos;ll send you a reminder a few days before check-in</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="flex-1"
        >
          Print Confirmation
        </Button>
      </div>
    </div>
  );
}
