"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import CollapsibleSection from "./CollapsibleSection";
import { AgentFormValues } from "@/types/agent";

function ServiceDescription() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AgentFormValues>();

  const serviceDescription = watch("serviceDescription") ?? "";

  return (
    <CollapsibleSection
      title="Service/Product Description"
      description="Add a knowledge base about your service or product."
    >
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your service or product..."
          rows={6}
          maxLength={20000}
          {...register("serviceDescription", {
            maxLength: {
              value: 20000,
              message: "Service description cannot exceed 20,000 characters",
            },
          })}
        />

        <div className="flex justify-between">
          {errors.serviceDescription ? (
            <p className="text-xs text-destructive">
              {errors.serviceDescription.message}
            </p>
          ) : (
            <span />
          )}

          <p className="text-xs text-muted-foreground">
            {serviceDescription.length}/20000
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default ServiceDescription;
