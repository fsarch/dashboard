'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { removePartType } from '@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/remove/PartTypeRemove.server-action';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';

type PartTypeRemoveProps = {
  partTypeId: string;
  homeUrl: string;
};

const PartTypeRemove: React.FunctionComponent<PartTypeRemoveProps> = ({
  partTypeId,
  homeUrl,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDeleteDialog({
      text: 'Möchtest du diesen PartType wirklich löschen?',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removePartType(partTypeId);

    router.push(homeUrl);
  }, [partTypeId, homeUrl]);

  return (
    <Section name="Danger Zone" color="#FF0000">
      <Button type="button" onClick={handleDeleteClick} color="#BB0000">
        PartType löschen
      </Button>
    </Section>
  );
};

export default PartTypeRemove;
