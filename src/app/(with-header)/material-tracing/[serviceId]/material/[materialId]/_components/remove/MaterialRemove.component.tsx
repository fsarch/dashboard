'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { useRouter } from "next/navigation";
import ConfirmDialogComponent from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Button from "@/components/universals/forms/Button";
import {
  removeMaterial
} from "@/app/(with-header)/material-tracing/[serviceId]/material/[materialId]/_components/remove/MaterialRemove.server-action";

type MaterialRemoveProps = {
  materialId: string;
  homeUrl: string;
};

const MaterialRemove: React.FunctionComponent<MaterialRemoveProps> = ({
  materialId,
  homeUrl,
}) => {
  const openDialog = useOpenDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDialog(ConfirmDialogComponent, {
      text: 'Möchtest du dieses Material wirklich löschen?',
      successButtonText: 'Löschen',
      successButtonColor: '#BB0000',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeMaterial(materialId);

    router.push(homeUrl);
  }, [materialId, homeUrl]);

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
        Material löschen
      </Button>
    </Section>
  );
};

export default MaterialRemove;
