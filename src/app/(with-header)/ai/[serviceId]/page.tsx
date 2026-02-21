import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import ConversationStarter from '@/components/apps/ai/ConversationStarter';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { conversationsService } from '@/services/ai/conversations.service';
import { redirect } from 'next/navigation';

export const generateMetadata = createAutomaticMetadata();

export default async function Home(props: { params: Promise<{ serviceId: string }> }) {
  const params = await props.params;
  const serviceId = params.serviceId;

  // server action to create a conversation from a posted FormData
  async function handleStart(formData: FormData) {
    'use server';
    const initialMessage = String(formData.get('initialMessage') || '').trim();
    if (!initialMessage) return null;
    const created = await conversationsService.createConversation({ name: initialMessage, initial_message: { content: initialMessage } }, { serviceId });
    if (created?.id) {
      redirect(`/ai/${serviceId}/conversations/${created.id}`);
    }
    return null;
  }

  return (
    <DefaultPage>
      <ConversationStarter serviceId={serviceId} onStart={handleStart} />
    </DefaultPage>
  );
}
