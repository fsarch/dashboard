'use server';

import { agentsService } from '@/services/ai/agents.service';

export async function removeAgent(agentId: string): Promise<void> {
  await agentsService.deleteAgent(agentId);
}
