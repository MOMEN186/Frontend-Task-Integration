export interface Agent {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  type: "inbound" | "outbound";
  model: "Pro" | "Standard" | "Flex";
}

export const agents: Agent[] = [
  {
    id: "1",
    name: "Sales Assistant",
    description: "Handles inbound sales inquiries and qualifies leads",
    createdAt: "Jan 12, 2025",
    modifiedAt: "Jan 25, 2025",
    type: "inbound",
    model: "Pro",
  },
  {
    id: "2",
    name: "Support Bot",
    description: "Resolves common customer support tickets automatically",
    createdAt: "Dec 5, 2024",
    modifiedAt: "Jan 20, 2025",
    type: "inbound",
    model: "Standard",
  },
  {
    id: "3",
    name: "Outreach Agent",
    description: "Runs outbound cold-call campaigns for lead generation",
    createdAt: "Jan 3, 2025",
    modifiedAt: "Jan 22, 2025",
    type: "outbound",
    model: "Pro",
  },
  {
    id: "4",
    name: "Survey Caller",
    description: "Conducts post-purchase satisfaction surveys",
    createdAt: "Nov 18, 2024",
    modifiedAt: "Jan 10, 2025",
    type: "outbound",
    model: "Flex",
  },
  {
    id: "5",
    name: "Appointment Setter",
    description: "Books and confirms appointments with prospects",
    createdAt: "Jan 8, 2025",
    modifiedAt: "Jan 24, 2025",
    type: "outbound",
    model: "Standard",
  },
  {
    id: "6",
    name: "Retention Agent",
    description: "Reaches out to churning customers with retention offers",
    createdAt: "Jan 15, 2025",
    modifiedAt: "Jan 26, 2025",
    type: "outbound",
    model: "Pro",
  },
  {
    id: "7",
    name: "Billing Helper",
    description: "Answers billing questions and processes refund requests",
    createdAt: "Dec 20, 2024",
    modifiedAt: "Jan 18, 2025",
    type: "inbound",
    model: "Standard",
  },
  {
    id: "8",
    name: "Onboarding Guide",
    description: "Walks new users through product setup and first steps",
    createdAt: "Jan 2, 2025",
    modifiedAt: "Jan 23, 2025",
    type: "inbound",
    model: "Flex",
  },
];
