import 'server-only';

import { fetchService } from '@/utils/fetchService';
import { MessageDto, CreateMessageDto, UpdateMessageDto } from './messages.type';

const listMessages = async (conversationId: string, options?: { serviceId?: string }): Promise<Array<MessageDto>> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/conversations/${conversationId}/messages`, undefined, opts);
  return await res.json();
};

const createMessage = async (conversationId: string, dto: CreateMessageDto, options?: { serviceId?: string }): Promise<MessageDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, opts);
  return await res.json();
};

const getMessage = async (conversationId: string, messageId: string, options?: { serviceId?: string }): Promise<MessageDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/conversations/${conversationId}/messages/${messageId}`, undefined, opts);
  return await res.json();
};

const updateMessage = async (conversationId: string, messageId: string, dto: UpdateMessageDto, options?: { serviceId?: string }): Promise<MessageDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/conversations/${conversationId}/messages/${messageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, opts);
  return await res.json();
};

const deleteMessage = async (conversationId: string, messageId: string, options?: { serviceId?: string }): Promise<void> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  await fetchService(`/v1/conversations/${conversationId}/messages/${messageId}`, { method: 'DELETE' }, opts);
};

export const messagesService = {
  listMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
};
