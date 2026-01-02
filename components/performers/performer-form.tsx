"use client";

import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { validatePerformerForm, type PerformerFormData } from "@/lib/validations";

interface PerformerFormProps {
  onSuccess?: () => void;
}

export function PerformerForm({ onSuccess }: PerformerFormProps) {
  const [formData, setFormData] = useState<PerformerFormData>({
    stageName: "",
    email: "",
    phone: "",
    location: "",
    socialMedia: "",
    genre: "",
    desiredRate: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PerformerFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PerformerFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");
    setServerError(null);

    const validation = validatePerformerForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!turnstileToken) {
      setServerError("Please complete the captcha verification.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/performers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const result = await response.json();

      if (response.status === 400 && result?.errors) {
        setErrors(result.errors);
        setSubmitStatus("error");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      if (!response.ok || !result?.success) {
        setSubmitStatus("error");
        setServerError(
          result?.message || "Something went wrong. Please try again."
        );
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      setSubmitStatus("success");
      setFormData({
        stageName: "",
        email: "",
        phone: "",
        location: "",
        socialMedia: "",
        genre: "",
        desiredRate: "",
        message: "",
      });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      onSuccess?.();
    } catch {
      setSubmitStatus("error");
      setServerError("Something went wrong. Please try again.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Application Submitted!
        </h3>
        <p className="text-gray-600">
          Thanks for your interest in performing at The Outpost! We&apos;ll review your submission and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="stageName"
            className="block text-sm font-medium text-gray-700"
          >
            Stage Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="stageName"
            name="stageName"
            value={formData.stageName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            aria-required="true"
            aria-invalid={!!errors.stageName}
          />
          {errors.stageName && (
            <p className="mt-1 text-sm text-red-600">{errors.stageName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            aria-required="true"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            aria-required="true"
            aria-invalid={!!errors.location}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700"
          >
            Genre/Style <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g., Americana, Blues, Folk"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            aria-required="true"
            aria-invalid={!!errors.genre}
          />
          {errors.genre && (
            <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="desiredRate"
            className="block text-sm font-medium text-gray-700"
          >
            Desired Rate
          </label>
          <input
            type="text"
            id="desiredRate"
            name="desiredRate"
            value={formData.desiredRate}
            onChange={handleChange}
            placeholder="e.g., $200-300 per show"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="socialMedia"
          className="block text-sm font-medium text-gray-700"
        >
          Social Media / Website
        </label>
        <input
          type="text"
          id="socialMedia"
          name="socialMedia"
          value={formData.socialMedia}
          onChange={handleChange}
          placeholder="Instagram, YouTube, or website link"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Tell us about yourself <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Share your experience, style, and why you'd like to perform at The Outpost..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          aria-required="true"
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {submitStatus === "error" && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {serverError ||
              "Something went wrong. Please try again or contact us directly."}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken(null)}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !turnstileToken} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
