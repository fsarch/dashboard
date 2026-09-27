import React from 'react';
import AgentRemove from '@/app/(with-header)/ai/[serviceId]/agents/[agentId]/_components/remove/AgentRemove.component';
import AgentsBetaBanner from '@/components/apps/ai/AgentsBetaBanner';
import AgentUpdateForm from '@/components/apps/ai/AgentUpdateForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { agentsService } from '@/services/ai/agents.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

export default async function AgentPage(props: {
  params: Promise<{ serviceId: string; agentId: string }>;
}) {
  const params = await props.params;
  const agent = await agentsService.getAgent(params.agentId, {
    serviceId: params.serviceId,
  });

  return (
    <DefaultPage>
      <AgentsBetaBanner>
        <Section name="Informationen">
          <AgentUpdateForm args={{ agent }} />
        </Section>
        <AgentRemove
          agentId={agent.id}
          homeUrl={await getServiceLocalUrl('/agents')}
        />
      </AgentsBetaBanner>
    </DefaultPage>
  );
}
