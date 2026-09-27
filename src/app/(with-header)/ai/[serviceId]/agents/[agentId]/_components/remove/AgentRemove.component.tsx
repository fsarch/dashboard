'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { removeAgent } from '@/app/(with-header)/ai/[serviceId]/agents/[agentId]/_components/remove/AgentRemove.server-action';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';

type AgentRemoveProps = {
  agentId: string;
  homeUrl: string;
};

const AgentRemove: React.FunctionComponent<AgentRemoveProps> = ({
  agentId,
  homeUrl,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDeleteDialog({
      text: 'Möchtest du diesen Agenten wirklich löschen?',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeAgent(agentId);

    router.push(homeUrl);
  }, [agentId, homeUrl]);

  return (
    <Section name="Danger Zone" color="#FF0000">
      <Button type="button" onClick={handleDeleteClick} color="#BB0000">
        Agent löschen
      </Button>
    </Section>
  );
};

export default AgentRemove;
