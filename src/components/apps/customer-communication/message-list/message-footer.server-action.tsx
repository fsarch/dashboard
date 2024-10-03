'use server';

import { EContentType } from "@/constants/apps/customer-communication/content-type.enum";
import { fetchService } from "@/utils/fetchService";

export async function sendMessage(serviceId: string, threadId: string, data: {
  content: string;
  contentType: EContentType;
}) {
  const createResponse = await fetchService(`/v1/threads/${threadId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      content: data.content,
      contentTypeId: data.contentType,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }, {
    serviceId,
  });

  if (!createResponse.ok) {
    console.error(createResponse);
    throw new Error('failed to send message');
  }

  return true;
}
