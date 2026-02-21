'use client'

import React, { useEffect, useState } from 'react';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Section from '@/components/universals/section/Section';
import { ConversationDto } from '@/services/ai/conversations.type';

type Props = {
  serviceId: string;
  conversations: Array<ConversationDto>;
};

const ConversationList: React.FC<Props> = ({ serviceId, conversations }) => {
  return (
    <Section name="Konversationen">
      <List>
        {(conversations ?? []).map((c) => (
          <LinkListItem key={c.id} href={`/ai/${serviceId}/conversations/${c.id}`}>
            {c.title || c.id}
          </LinkListItem>
        ))}
      </List>
    </Section>
  );
}

export default ConversationList;
