import 'server-only';

import { fetchService } from '@/utils/fetchService';
import type { ConversationDto, CreateConversationDto, UpdateConversationDto, UserDto } from './conversations.type';

const BASE = '/v1';

async function listConversations(opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations`, undefined, opts);
  return res.json() as Promise<ConversationDto[]>;
}

async function createConversation(data: CreateConversationDto, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, opts);
  if (res.status === 201 || res.ok) return res.json() as Promise<ConversationDto>;
  throw new Error(`Could not create conversation: ${res.status}`);
}

async function getConversation(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(id)}`, undefined, opts);
  return res.json() as Promise<ConversationDto>;
}

async function updateConversation(id: string, data: UpdateConversationDto, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, opts);
  if (!res.ok) throw new Error(`Could not update conversation: ${res.status}`);
  return res.json() as Promise<ConversationDto>;
}

async function deleteConversation(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(id)}`, { method: 'DELETE' }, opts);
  if (!res.ok) throw new Error(`Could not delete conversation: ${res.status}`);
  return;
}

async function getMembers(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(id)}/members`, undefined, opts);
  if (res.status === 404) throw new Error('Conversation not found');
  return res.json() as Promise<UserDto[]>;
}

export const conversationsService = {
  listConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
  getMembers,
};
