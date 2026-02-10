"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BasicSettings from "./BasicSettings";
import CallScript from "./CallScript";
import ServiceDescription from "./ServiceDescription";
import Tools from "./Tools";
import ReferenceData from "./ReferenceData";
import TestCallCard, { TestCallPayload } from "./TestCallCard";
import type { AgentFormInitialData, AgentFormValues } from "@/types/agent";

type AgentFormProps = {
  mode: "create" | "edit";
  initialData?: AgentFormInitialData;
};

export function AgentForm({ mode, initialData }: AgentFormProps) {
  const [agentId, setAgentId] = useState<string | null>(
    initialData?.id ?? null,
  );

  const methods = useForm<AgentFormValues>({
    defaultValues: {
      agentName: initialData?.agentName ?? "",
      description: initialData?.description ?? "",
      callType:
        (initialData?.callType as AgentFormValues["callType"]) ?? "inbound",
      language: initialData?.language ?? "",
      voice: initialData?.voice ?? "",
      prompt: initialData?.prompt ?? "",
      model: initialData?.model ?? "",
      latency: initialData?.latency ?? 0.5,
      speed: initialData?.speed ?? 110,
      callScript: initialData?.callScript ?? "",
      serviceDescription: initialData?.serviceDescription ?? "",
      attachments: [],
      tools: {
        allowHangUp: true,
        allowCallback: false,
        liveTransfer: false,
      },
    },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // compute badge from RHF values
  const w = watch();
  const basicSettingsMissing = [
    w.agentName,
    w.callType,
    w.language,
    w.voice,
    w.prompt,
    w.model,
  ].filter((v) => !v).length;

  const saveAgent = async (values: AgentFormValues): Promise<string | null> => {
    const url = agentId ? `/api/agents/${agentId}` : "/api/agents";

    try {
      const res = await fetch(url, {
        method: agentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.agentName,
          description: values.description,
          callType: values.callType,
          language: values.language,
          voice: values.voice,
          prompt: values.prompt,
          model: values.model,
          latency: values.latency,
          speed: values.speed,
          callScript: values.callScript,
          serviceDescription: values.serviceDescription,
          attachments: values.attachments,
          tools: values.tools,
        }),
      });

      if (!res.ok) throw new Error("Failed to save agent");

      const data = await res.json();
      const isUpdate = Boolean(agentId);
      setAgentId(data?.id);
      toast.success(`Agent ${isUpdate ? "updated" : "created"} successfully`);

      return data?.id ?? null;
    } catch (e) {
      console.error(e);
      toast.error("Failed to save agent");
      return null;
    }
  };

  const onSubmit = async (values: AgentFormValues) => {
    await saveAgent(values);
  };

  const onStartCall = async (payload: TestCallPayload) => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    const values = methods.getValues();
    const savedId = await saveAgent(values);
    if (!savedId) return;

    await fetch(`/api/agents/${savedId}/test-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const heading = mode === "create" ? "Create Agent" : "Edit Agent";
  const saveLabel = mode === "create" ? "Save Agent" : "Save Changes";

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-6 p-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{heading}</h1>
          <Button type="submit" disabled={isSubmitting}>
            {saveLabel}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Section-1 Basic Settings */}
            <BasicSettings badge={basicSettingsMissing} />
            {/* Section-2 Call Script */}
            <CallScript />
            {/* Section-3 Service Description */}
            <ServiceDescription />
            {/* Section-4 Reference Data */}
            <ReferenceData />
            {/* Section-5 Tools */}
            <Tools />
          </div>

          <div className="lg:col-span-1">
            {/* Section-6 Test Call */}
            <TestCallCard onStartCall={onStartCall} disabled={isSubmitting} />
          </div>
        </div>
        {/* Sticky bottom save bar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-background px-6 py-4">
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {saveLabel}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
