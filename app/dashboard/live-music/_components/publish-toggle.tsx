"use client";

import { useOptimistic, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { togglePublish } from "../actions";

interface PublishToggleProps {
  eventId: string;
  initialPublished: boolean;
}

export function PublishToggle({ eventId, initialPublished }: PublishToggleProps) {
  const [optimisticPublished, setOptimisticPublished] = useOptimistic(initialPublished);
  const [pending, startTransition] = useTransition();

  const handleToggle = () => {
    const next = !optimisticPublished;
    setOptimisticPublished(next);

    startTransition(async () => {
      const result = await togglePublish(eventId, next);
      if (result?.error) {
        setOptimisticPublished(!next);
        // Minimal inline fallback; could swap to toast
        console.error("Failed to toggle publish:", result.error);
      }
    });
  };

  return (
    <Button
      type="button"
      variant={optimisticPublished ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={pending}
      className="min-w-[110px]"
    >
      {pending ? "Saving..." : optimisticPublished ? "Published" : "Unpublished"}
    </Button>
  );
}
