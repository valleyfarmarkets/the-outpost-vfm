'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useBookingContext } from '@/context/booking-context';
import { BookingWizard } from './booking-wizard';

/**
 * Booking Modal
 *
 * Root modal component for the booking flow
 * Uses Radix UI Dialog for accessibility
 */
export function BookingModal() {
  const { state, actions } = useBookingContext();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Show confirmation if booking is in progress
      if (state.currentStep > 1 && state.currentStep < 6) {
        const confirmed = window.confirm(
          'Are you sure you want to cancel? Your booking progress will be lost.'
        );
        if (confirmed) {
          actions.reset();
          actions.closeModal();
        }
      } else {
        actions.closeModal();
      }
    }
  };

  return (
    <Dialog.Root open={state.isModalOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl md:w-full">
          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Modal content - scroll container */}
          <div className="overflow-y-auto max-h-[90vh]">
            <BookingWizard />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
