'use server';

import type { MessageWithAuthor } from '@/services/ai/messages.type';
import { messagesService } from '@/services/ai/messages.service';

export const sendMessageToServer = async ({ conversationId, content }: { conversationId: string; content: string }): Promise<MessageWithAuthor[]> => {
  const result = await messagesService.createMessage(conversationId, { content });
  // createMessage now always returns MessageWithAuthor[] per API contract
  return result ?? [];
};
