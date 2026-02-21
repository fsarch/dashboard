import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import ConversationView from '@/components/apps/ai/ConversationView';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getThemeConfiguration } from '@/utils/configuration.utils';
import { conversationsService } from '@/services/ai/conversations.service';
import { messagesService } from '@/services/ai/messages.service';

export const generateMetadata = createAutomaticMetadata();

export default async function ConversationPage(props: { params: Promise<{ serviceId: string; conversationId: string }> }) {
  const params = await props.params;
  const { serviceId, conversationId } = params;
  const theme = await getThemeConfiguration();
  const primary = theme?.primaryColor?.hex ?? '#32a852';

  // load conversation and messages server-side
  const conversation = await conversationsService.getConversation(conversationId, { serviceId });
  const messages = await messagesService.listMessages(conversationId, { serviceId });

  return (
    <DefaultPage>
      <ConversationView
        serviceId={serviceId}
        conversationId={conversationId}
        primaryColor={primary}
        conversation={conversation}
        messages={messages}
      />
    </DefaultPage>
  );
}
