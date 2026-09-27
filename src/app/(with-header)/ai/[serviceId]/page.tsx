import { redirect } from 'next/navigation';
import React from 'react';
import ConversationStarter from '@/components/apps/ai/ConversationStarter';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { agentsService } from '@/services/ai/agents.service';
import { conversationsService } from '@/services/ai/conversations.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function Home(props: {
  params: Promise<{ serviceId: string }>;
}) {
  const params = await props.params;
  const serviceId = params.serviceId;

  const agents = (await agentsService.listAgents({ serviceId })).filter(
    (a) => a.is_visible,
  );

  // server action to create a conversation from a posted FormData
  async function handleStart(values: {
    initialMessage: string;
    agentId?: string;
  }) {
    'use server';
    const initialMessage = values.initialMessage.trim();
    if (!initialMessage) return null;
    const agentId = values.agentId || undefined;
    const created = await conversationsService.createConversation(
      {
        name: initialMessage,
        default_agent_id: agentId,
        initial_message: { content: initialMessage, agent_id: agentId },
      },
      { serviceId },
    );
    if (created?.id) {
      redirect(`/ai/${serviceId}/conversations/${created.id}`);
    }
    return null;
  }

  return (
    <DefaultPage>
      <ConversationStarter
        serviceId={serviceId}
        agents={agents}
        onStart={handleStart}
      />
    </DefaultPage>
  );
}
