'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { useRouter } from "next/navigation";
import ConfirmDialogComponent from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Button from "@/components/universals/forms/Button";
import {
  removeManufacturer
} from "@/app/(with-header)/material-tracing/[serviceId]/manufacturer/[manufacturerId]/_components/remove/ManufacturerRemove.server-action";

type ManufacturerRemoveProps = {
  manufacturerId: string;
  homeUrl: string;
};

const ManufacturerRemove: React.FunctionComponent<ManufacturerRemoveProps> = ({
  manufacturerId,
  homeUrl,
}) => {
  const openDialog = useOpenDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDialog(ConfirmDialogComponent, {
      text: 'Möchtest du diesen Hersteller wirklich löschen?',
      successButtonText: 'Löschen',
      successButtonColor: '#BB0000',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeManufacturer(manufacturerId);

    router.push(homeUrl);
  }, [manufacturerId, homeUrl]);

  return (
    <Section
      name="Danger Zone"
      color="#FF0000"
    >
      <Button
        type="button"
        onClick={handleDeleteClick}
        color="#BB0000"
      >
        Hersteller löschen
      </Button>
    </Section>
  );
};

export default ManufacturerRemove;
