import 'server-only';

import { fetchService } from '@/utils/fetchService';
import type { MessageDto, CreateMessageDto, UpdateMessageDto } from './messages.type';

const BASE = '/v1';

async function listMessages(conversationId: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(conversationId)}/messages`, undefined, opts);
  return res.json() as Promise<MessageDto[]>;
}

async function createMessage(conversationId: string, data: CreateMessageDto, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(conversationId)}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, opts);
  if (res.status === 201 || res.ok) return res.json() as Promise<MessageDto>;
  throw new Error(`Could not create message: ${res.status}`);
}

async function getMessage(conversationId: string, messageId: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`, undefined, opts);
  return res.json() as Promise<MessageDto>;
}

async function updateMessage(conversationId: string, messageId: string, data: UpdateMessageDto, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, opts);
  if (!res.ok) throw new Error(`Could not update message: ${res.status}`);
  return res.json() as Promise<MessageDto>;
}

async function deleteMessage(conversationId: string, messageId: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`, { method: 'DELETE' }, opts);
  if (!res.ok) throw new Error(`Could not delete message: ${res.status}`);
  return;
}

export const messagesService = {
  listMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
};
