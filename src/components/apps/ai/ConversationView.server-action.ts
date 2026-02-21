'use server';

import { messagesService } from "@/services/ai/messages.service";

export const sendMessageToServer = async ({ conversationId, content }: { conversationId: string, content: string }) => {
  const created = await messagesService.createMessage(conversationId, { role: 'user', content });

  return created;
}
