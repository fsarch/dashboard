import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import ConversationList from '@/components/apps/ai/ConversationList';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { conversationsService } from "@/services/ai/conversations.service";

export const generateMetadata = createAutomaticMetadata();

export default async function ConversationsPage(props: { params: Promise<{ serviceId: string }> }) {
  const params = await props.params;

  const conversations = await conversationsService.listConversations();

  return (
    <DefaultPage>
      <ConversationList
        serviceId={params.serviceId}
        conversations={conversations}
      />
    </DefaultPage>
  );
}
