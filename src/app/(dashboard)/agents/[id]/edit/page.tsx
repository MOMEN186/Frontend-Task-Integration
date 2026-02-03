"use client";

import { useParams } from "next/navigation";
import { agents } from "@/data/agents";
import { AgentForm, AgentFormInitialData } from "@/components/agents/agent-form";

export default function EditAgentPage() {
  const { id } = useParams<{ id: string }>();
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground">Agent not found.</p>
      </div>
    );
  }

  const initialData: AgentFormInitialData = {
    agentName: agent.name,
    description: agent.description,
    callType: agent.type,
    model: agent.model.toLowerCase(),
  };

  return <AgentForm mode="edit" initialData={initialData} />;
}
