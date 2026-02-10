"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import CollapsibleSection from "./CollapsibleSection";
import type { AgentFormValues } from "@/types/agent";

function CallScript() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AgentFormValues>();

  const callScript = watch("callScript") ?? "";

  return (
    <CollapsibleSection
      title="Call Script"
      description="What would you like the AI agent to say during the call?"
    >
      <div className="space-y-2">
        <Textarea
          placeholder="Write your call script here..."
          rows={6}
          maxLength={20000}
          {...register("callScript", {
            maxLength: {
              value: 20000,
              message: "Call script cannot exceed 20,000 characters",
            },
          })}
        />

        <div className="flex justify-between">
          {errors.callScript ? (
            <p className="text-xs text-destructive">
              {errors.callScript.message}
            </p>
          ) : (
            <span />
          )}

          <p className="text-xs text-muted-foreground">
            {callScript.length}/20000
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default CallScript;
