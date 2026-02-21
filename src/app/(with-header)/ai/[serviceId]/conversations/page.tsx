import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import ConversationList from '@/components/apps/ai/ConversationList';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function ConversationsPage(props: { params: Promise<{ serviceId: string }> }) {
  const params = await props.params;
  return (
    <DefaultPage>
      <ConversationList serviceId={params.serviceId} />
    </DefaultPage>
  );
}
