export type AgentDto = {
  id: string;
  external_id?: string | null;
  name: string;
  description?: string | null;
  system_prompt: string;
  provider_id: string;
  model_id: string;
  is_visible: boolean;
  creation_time: string;
  deletion_time?: string | null;
};

export type CreateAgentDto = {
  external_id?: string;
  name: string;
  description?: string;
  system_prompt?: string;
  provider_id: string;
  model_id: string;
  is_visible?: boolean;
};

export type UpdateAgentDto = Partial<CreateAgentDto>;
