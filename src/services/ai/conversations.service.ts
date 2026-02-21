import 'server-only';

import { fetchService } from '@/utils/fetchService';
import { ConversationDto, CreateConversationDto, UpdateConversationDto } from './conversations.type';

const listConversations = async (options?: { serviceId?: string }): Promise<Array<ConversationDto>> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService('/v1/conversations', undefined, opts);
  return await res.json();
};

const createConversation = async (dto: CreateConversationDto, options?: { serviceId?: string }): Promise<ConversationDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService('/v1/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, opts);
  return await res.json();
};

const getConversation = async (id: string, options?: { serviceId?: string }): Promise<ConversationDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/conversations/${id}`, undefined, opts);
  return await res.json();
};

const updateConversation = async (id: string, dto: UpdateConversationDto, options?: { serviceId?: string }): Promise<ConversationDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/conversations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, opts);
  return await res.json();
};

const deleteConversation = async (id: string, options?: { serviceId?: string }): Promise<void> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  await fetchService(`/v1/conversations/${id}`, { method: 'DELETE' }, opts);
};

export const conversationsService = {
  listConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
};
