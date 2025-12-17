'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { GuestDetailsFormData } from '@/lib/booking/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Guest Info Form - Pure Presentational Component
 *
 * Displays guest contact form fields without managing state.
 * All form logic (validation, submission) is owned by parent component.
 */

interface GuestInfoFormProps {
  register: UseFormRegister<GuestDetailsFormData>;
  errors: FieldErrors<GuestDetailsFormData>;
  isSubmitting: boolean;
}

export function GuestInfoForm({ register, errors, isSubmitting }: GuestInfoFormProps) {
  return (
    <div className="space-y-4">
      {/* First Name */}
      <div>
        <Label htmlFor="firstName">
          First Name <span className="text-red-600">*</span>
        </Label>
        <Input
          {...register('firstName')}
          id="firstName"
          disabled={isSubmitting}
          aria-invalid={errors.firstName ? 'true' : 'false'}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          className={`mt-1.5 ${errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          placeholder="John"
        />
        {errors.firstName && (
          <p id="firstName-error" className="text-sm text-red-600 mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="lastName">
          Last Name <span className="text-red-600">*</span>
        </Label>
        <Input
          {...register('lastName')}
          id="lastName"
          disabled={isSubmitting}
          aria-invalid={errors.lastName ? 'true' : 'false'}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          className={`mt-1.5 ${errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Doe"
        />
        {errors.lastName && (
          <p id="lastName-error" className="text-sm text-red-600 mt-1">
            {errors.lastName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">
          Email <span className="text-red-600">*</span>
        </Label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          disabled={isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`mt-1.5 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600 mt-1">
            {errors.email.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">Confirmation will be sent to this email</p>
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">
          Phone Number <span className="text-red-600">*</span>
        </Label>
        <Input
          {...register('phone')}
          id="phone"
          type="tel"
          disabled={isSubmitting}
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={`mt-1.5 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-600 mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Notes (optional) */}
      <div>
        <Label htmlFor="notes">Special Requests (Optional)</Label>
        <Textarea
          {...register('notes')}
          id="notes"
          disabled={isSubmitting}
          aria-invalid={errors.notes ? 'true' : 'false'}
          aria-describedby={errors.notes ? 'notes-error' : undefined}
          className={`mt-1.5 ${errors.notes ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Any special requests or requirements?"
          rows={3}
        />
        {errors.notes && (
          <p id="notes-error" className="text-sm text-red-600 mt-1">
            {errors.notes.message}
          </p>
        )}
      </div>
    </div>
  );
}
