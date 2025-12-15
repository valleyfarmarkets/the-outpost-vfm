'use client';

import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestDetailsSchema, type GuestDetailsFormData } from '@/lib/booking/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Guest Info Form
 *
 * Collects guest contact details using React Hook Form + Zod
 */

interface GuestInfoFormProps {
  defaultValues?: Partial<GuestDetailsFormData>;
  onSubmit: (data: GuestDetailsFormData) => void;
  isSubmitting?: boolean;
}

export const GuestInfoForm = forwardRef<HTMLFormElement, GuestInfoFormProps>(function GuestInfoForm({ defaultValues, onSubmit, isSubmitting }, ref) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestDetailsFormData>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* First Name */}
      <div>
        <Label htmlFor="firstName">
          First Name <span className="text-red-600">*</span>
        </Label>
        <Input
          id="firstName"
          {...register('firstName')}
          disabled={isSubmitting}
          className="mt-1.5"
          placeholder="John"
        />
        {errors.firstName && (
          <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="lastName">
          Last Name <span className="text-red-600">*</span>
        </Label>
        <Input
          id="lastName"
          {...register('lastName')}
          disabled={isSubmitting}
          className="mt-1.5"
          placeholder="Doe"
        />
        {errors.lastName && (
          <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">
          Email <span className="text-red-600">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={isSubmitting}
          className="mt-1.5"
          placeholder="john.doe@example.com"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        <p className="text-xs text-gray-500 mt-1">Confirmation will be sent to this email</p>
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">
          Phone Number <span className="text-red-600">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          disabled={isSubmitting}
          className="mt-1.5"
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
      </div>

      {/* Notes (optional) */}
      <div>
        <Label htmlFor="notes">Special Requests (Optional)</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          disabled={isSubmitting}
          className="mt-1.5"
          placeholder="Any special requests or requirements?"
          rows={3}
        />
        {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>}
      </div>
    </form>
  );
});
