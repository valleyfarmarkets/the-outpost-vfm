"use client";

import { useOptimistic, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateStatus } from "../actions";

interface StatusToggleProps {
  submissionId: string;
  initialStatus: "new" | "handled";
}

export function StatusToggle({ submissionId, initialStatus }: StatusToggleProps) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(initialStatus);
  const [pending, startTransition] = useTransition();

  const nextStatus = optimisticStatus === "new" ? "handled" : "new";

  const handleClick = () => {
    setOptimisticStatus(nextStatus);

    startTransition(async () => {
      const result = await updateStatus(submissionId, nextStatus);
      if (result?.error) {
        setOptimisticStatus(optimisticStatus);
        console.error("Failed to update status:", result.error);
      }
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={optimisticStatus === "handled" ? "secondary" : "outline"}
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? "Updating..." : optimisticStatus === "handled" ? "Handled" : "Mark handled"}
    </Button>
  );
}
