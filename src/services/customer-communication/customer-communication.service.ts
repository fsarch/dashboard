import type {
  TMessage,
  TThread,
} from '@/services/customer-communication/customer-communication.type';
import { fetchService } from '@/utils/fetchService';

const listThreads = async (): Promise<Array<TThread>> => {
  const threadsResponse = await fetchService('/v1/threads');
  const threads = await threadsResponse.json();

  return threads;
};
const listThreadMessages = async (
  threadId: string,
): Promise<Array<TMessage>> => {
  const messagesResponse = await fetchService(
    `/v1/threads/${threadId}/messages`,
  );
  const messages = await messagesResponse.json();

  return messages;
};

export const customerCommunicationService = {
  listThreads,
  listThreadMessages,
};
