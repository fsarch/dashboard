import React from 'react';
import { AgentCreateForm } from '@/components/apps/ai/AgentCreateForm.component';
import AgentList from '@/components/apps/ai/AgentList';
import AgentsBetaBanner from '@/components/apps/ai/AgentsBetaBanner';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { agentsService } from '@/services/ai/agents.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function AgentsPage(props: {
  params: Promise<{ serviceId: string }>;
}) {
  const params = await props.params;
  const serviceId = params.serviceId;

  const agents = await agentsService.listAgents({ serviceId });

  return (
    <DefaultPage>
      <AgentsBetaBanner>
        <Section name="Agent erstellen">
          <AgentCreateForm />
        </Section>
        <AgentList serviceId={serviceId} agents={agents} />
      </AgentsBetaBanner>
    </DefaultPage>
  );
}
