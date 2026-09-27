'use client';

import type React from 'react';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import Section from '@/components/universals/section/Section';
import type { AgentDto } from '@/services/ai/agents.type';

type Props = {
  serviceId: string;
  agents: Array<AgentDto>;
};

const AgentList: React.FC<Props> = ({ serviceId, agents }) => {
  return (
    <Section name="Agenten">
      <List>
        {(agents ?? []).map((a) => (
          <LinkListItem key={a.id} href={`/ai/${serviceId}/agents/${a.id}`}>
            {a.name || a.id}
          </LinkListItem>
        ))}
      </List>
    </Section>
  );
};

export default AgentList;
