import React from 'react';
import ConversationList from '@/components/apps/ai/ConversationList';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { conversationsService } from '@/services/ai/conversations.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function ConversationsPage(props: {
  params: Promise<{ serviceId: string }>;
}) {
  const params = await props.params;
  const serviceId = params.serviceId;

  const conversations = await conversationsService.listConversations({
    serviceId,
  });

  return (
    <DefaultPage>
      <ConversationList serviceId={serviceId} conversations={conversations} />
    </DefaultPage>
  );
}
