'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Progress Indicator
 *
 * Shows visual progress through the 6-step booking flow
 */

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Dates' },
  { number: 2, label: 'Guests' },
  { number: 3, label: 'Quote' },
  { number: 4, label: 'Details' },
  { number: 5, label: 'Payment' },
  { number: 6, label: 'Confirm' },
];

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="py-6 px-6 border-b bg-gray-50">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                  {
                    // Completed steps
                    'bg-brand-primary border-brand-primary text-white':
                      step.number < currentStep,
                    // Current step
                    'bg-white border-brand-primary text-brand-primary':
                      step.number === currentStep,
                    // Future steps
                    'bg-white border-gray-300 text-gray-400': step.number > currentStep,
                  }
                )}
              >
                {step.number < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              {/* Step label */}
              <span
                className={cn('mt-1 text-xs font-medium hidden sm:block', {
                  'text-brand-primary': step.number <= currentStep,
                  'text-gray-400': step.number > currentStep,
                })}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn('flex-1 h-0.5 mx-2 transition-colors', {
                  'bg-brand-primary': step.number < currentStep,
                  'bg-gray-300': step.number >= currentStep,
                })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
