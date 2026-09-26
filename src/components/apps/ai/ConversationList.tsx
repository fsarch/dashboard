'use client';

import type React from 'react';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import Section from '@/components/universals/section/Section';
import type { ConversationDto } from '@/services/ai/conversations.type';

type Props = {
  serviceId: string;
  conversations: Array<ConversationDto>;
};

const ConversationList: React.FC<Props> = ({ serviceId, conversations }) => {
  return (
    <Section name="Konversationen">
      <List>
        {(conversations ?? []).map((c) => (
          <LinkListItem
            key={c.id}
            href={`/ai/${serviceId}/conversations/${c.id}`}
          >
            {c.name || c.id}
          </LinkListItem>
        ))}
      </List>
    </Section>
  );
};

export default ConversationList;
