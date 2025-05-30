'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { useRouter } from "next/navigation";
import ConfirmDialogComponent from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Button from "@/components/universals/forms/Button";
import {
  removePartType
} from "@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/remove/PartTypeRemove.server-action";

type PartTypeRemoveProps = {
  partTypeId: string;
  homeUrl: string;
};

const PartTypeRemove: React.FunctionComponent<PartTypeRemoveProps> = ({
  partTypeId,
  homeUrl,
}) => {
  const openDialog = useOpenDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDialog(ConfirmDialogComponent, {
      text: 'Möchtest du diesen PartType wirklich löschen?',
      successButtonText: 'Löschen',
      successButtonColor: '#BB0000',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removePartType(partTypeId);

    router.push(homeUrl);
  }, [partTypeId, homeUrl]);

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
        PartType löschen
      </Button>
    </Section>
  );
};

export default PartTypeRemove;
