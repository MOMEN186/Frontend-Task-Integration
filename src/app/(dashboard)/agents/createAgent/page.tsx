"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AgentForm, AgentFormInitialData } from "@/components/agents/agent-form";

function CreateAgentContent() {
  const searchParams = useSearchParams();

  const initialData: AgentFormInitialData = {
    agentName: searchParams.get("name") ?? "",
    description: searchParams.get("description") ?? "",
    callType: searchParams.get("callType") ?? "",
  };

  return <AgentForm mode="create" initialData={initialData} />;
}

export default function CreateAgentPage() {
  return (
    <Suspense>
      <CreateAgentContent />
    </Suspense>
  );
}
