'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { removeManufacturer } from '@/app/(with-header)/material-tracing/[serviceId]/manufacturer/[manufacturerId]/_components/remove/ManufacturerRemove.server-action';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';

type ManufacturerRemoveProps = {
  manufacturerId: string;
  homeUrl: string;
};

const ManufacturerRemove: React.FunctionComponent<ManufacturerRemoveProps> = ({
  manufacturerId,
  homeUrl,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDeleteDialog({
      text: 'Möchtest du diesen Hersteller wirklich löschen?',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeManufacturer(manufacturerId);

    router.push(homeUrl);
  }, [manufacturerId, homeUrl]);

  return (
    <Section name="Danger Zone" color="#FF0000">
      <Button type="button" onClick={handleDeleteClick} color="#BB0000">
        Hersteller löschen
      </Button>
    </Section>
  );
};

export default ManufacturerRemove;
