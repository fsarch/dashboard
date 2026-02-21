import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import ConversationView from '@/components/apps/ai/ConversationView';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getThemeConfiguration } from '@/utils/configuration.utils';

export const generateMetadata = createAutomaticMetadata();

export default async function ConversationPage(props: { params: Promise<{ serviceId: string; conversationId: string }> }) {
  const params = await props.params;
  const theme = await getThemeConfiguration();
  const primary = theme?.primaryColor?.hex ?? '#32a852';

  return (
    <DefaultPage>
      <ConversationView
        serviceId={params.serviceId}
        conversationId={params.conversationId}
        primaryColor={primary}
      />
    </DefaultPage>
  );
}
