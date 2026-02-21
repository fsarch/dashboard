import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import ConversationStarter from '@/components/apps/ai/ConversationStarter';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function Home(props: { params: Promise<{ serviceId: string }> }) {
  const params = await props.params;

  const handleStart = async (initialMessage: string) => {
    'use server';

    // TODO: call backend to create conversation
    console.log('start conversation', params, initialMessage);
  }

  return (
    <DefaultPage>
      <ConversationStarter onStart={handleStart} />
    </DefaultPage>
  );
}
