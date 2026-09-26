'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { removeMaterial } from '@/app/(with-header)/material-tracing/[serviceId]/material/[materialId]/_components/remove/MaterialRemove.server-action';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';

type MaterialRemoveProps = {
  materialId: string;
  homeUrl: string;
};

const MaterialRemove: React.FunctionComponent<MaterialRemoveProps> = ({
  materialId,
  homeUrl,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDeleteDialog({
      text: 'Möchtest du dieses Material wirklich löschen?',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeMaterial(materialId);

    router.push(homeUrl);
  }, [materialId, homeUrl]);

  return (
    <Section name="Danger Zone" color="#FF0000">
      <Button type="button" onClick={handleDeleteClick} color="#BB0000">
        Material löschen
      </Button>
    </Section>
  );
};

export default MaterialRemove;
