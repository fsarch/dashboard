import 'server-only';

import { fetchService } from '@/utils/fetchService';
import type { AgentDto } from './agents.type';

const BASE = '/v1';

async function listAgents(opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/agents`, undefined, opts);
  return res.json() as Promise<AgentDto[]>;
}

async function getAgent(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(
    `${BASE}/agents/${encodeURIComponent(id)}`,
    undefined,
    opts,
  );
  return res.json() as Promise<AgentDto>;
}

async function deleteAgent(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(
    `${BASE}/agents/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    opts,
  );
  if (!res.ok) throw new Error(`Could not delete agent: ${res.status}`);
  return;
}

export const agentsService = {
  listAgents,
  getAgent,
  deleteAgent,
};
