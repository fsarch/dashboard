import 'server-only';

import { fetchService } from '@/utils/fetchService';
import { conversationsService } from './conversations.service';
import type { MessageDto, CreateMessageDto, UpdateMessageDto, MessageWithAuthor } from './messages.type';
import type { UserDto } from './users.type';

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

// New: fetch messages and enrich with author user data
export async function listMessagesWithAuthors(conversationId: string, opts?: { serviceId: string }): Promise<MessageWithAuthor[]> {
  const messages = await listMessages(conversationId, opts);
  // collect unique author ids
  // Fetch members of the conversation in a single request (contains exactly the users involved)
  const members: Array<UserDto> = await conversationsService.getMembers(conversationId, opts).catch(() => []);
  if (!members || members.length === 0) {
    // attach null author_user where none provided
    return messages.map((m) => ({ ...m, author_user: m.author_user ?? null }));
  }

  const userMap = new Map(members.map((u) => [u.id, u]));

  // attach user object to each message
  return messages.map((m) => {
    const author = m.author_user_id ? (userMap.get(m.author_user_id) ?? null) : m.author_user ?? null;
    return { ...m, author_user: author } as MessageWithAuthor;
  });
}

export const messagesService = {
  listMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  listMessagesWithAuthors,
};
