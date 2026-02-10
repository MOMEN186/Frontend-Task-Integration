// src/types/agent.d.ts

export type AgentFormValues = {
  agentName: string;
  description?: string;
  callType: "inbound" | "outbound";
  language: string;
  voice: string;
  prompt: string;
  model: string;
  latency: number;
  speed: number;
  callScript?: string;
  serviceDescription?: string;
  attachments: string[];
  tools: {
    allowHangUp: boolean;
    allowCallback: boolean;
    liveTransfer: boolean;
  };
};

export interface AgentFormInitialData {
  id: string;
  agentName?: string;
  description?: string;
  callType?: string;
  language?: string;
  voice?: string;
  prompt?: string;
  model?: string;
  latency?: number;
  speed?: number;
  callScript?: string;
  serviceDescription?: string;
}

export type LanguagesDropdown = { code: string; id: string; name: string };
export type VoicesDropdown = {
  id: string;
  name: string;
  tag: string;
  language: string;
};
export type ModelsDropdown = { id: string; name: string; description: string };
export type PromptsDropdown = { id: string; name: string; description: string };
