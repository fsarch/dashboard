'use client'

import React from 'react';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Section from '@/components/universals/section/Section';

type ChatSummary = { id: string; title: string };

const mockSummaries: ChatSummary[] = [
  { id: 'conv-1', title: 'Fragen zum Produkt-Import' },
  { id: 'conv-2', title: 'Preisberechnung' },
];

type Props = {
  serviceId: string;
}

const ConversationList: React.FC<Props> = ({ serviceId }) => {
  return (
    <Section name="Konversationen">
      <List>
        {mockSummaries.map((s) => (
          <LinkListItem key={s.id} href={`/ai/${serviceId}/conversations/${s.id}`}>
            {s.title}
          </LinkListItem>
        ))}
      </List>
    </Section>
  );
}

export default ConversationList;
