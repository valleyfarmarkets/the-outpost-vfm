import { Shield, AlertCircle, DollarSign } from "lucide-react";
import type { CancellationPolicy as CancellationPolicyType } from "@/types/cabins";
import { cn, formatPrice } from "@/lib/utils";

interface CancellationPolicyProps {
  policy?: CancellationPolicyType;
  securityDeposit?: number;
  className?: string;
}

const policyTypeColors = {
  Flexible: "text-green-700 bg-green-50 border-green-200",
  Moderate: "text-yellow-700 bg-yellow-50 border-yellow-200",
  Strict: "text-red-700 bg-red-50 border-red-200",
};

export function CancellationPolicy({
  policy,
  securityDeposit,
  className,
}: CancellationPolicyProps) {
  if (!policy) {
    return null;
  }

  const colorClasses = policyTypeColors[policy.type];

  return (
    <div className={cn("border-t border-gray-200 pt-10", className)}>
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#221F1F]" />
        <h2 className="font-serif text-2xl font-semibold text-[#221F1F]">
          Cancellation Policy
        </h2>
      </div>

      {/* Policy Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {/* Policy Type Badge */}
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-brand-primary" />
          <div>
            <span
              className={cn(
                "inline-block rounded-full border px-3 py-1 text-sm font-semibold",
                colorClasses
              )}
            >
              {policy.type} Cancellation
            </span>
          </div>
        </div>

        {/* Refund Rules */}
        <div className="mt-6 space-y-4">
          {policy.rules.map((rule, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {rule.timeframe}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {rule.refundPercentage}% refund of accommodation fees
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-2xl font-bold text-brand-primary">
                  {rule.refundPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Notes */}
        {policy.additionalNotes && (
          <div className="mt-6 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm text-blue-900">
              {policy.additionalNotes}
            </p>
          </div>
        )}

        {/* Security Deposit Callout */}
        {securityDeposit && securityDeposit > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <DollarSign className="h-5 w-5 shrink-0 text-yellow-700" />
            <div>
              <p className="font-semibold text-yellow-900">
                Security Deposit: {formatPrice(securityDeposit)}
              </p>
              <p className="mt-1 text-sm text-yellow-800">
                A refundable security deposit is required for this cabin. It will be
                returned within 7 days after checkout if no damage occurs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
