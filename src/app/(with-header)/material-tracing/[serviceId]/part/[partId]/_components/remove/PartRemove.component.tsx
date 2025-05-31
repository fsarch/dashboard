'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { useRouter } from "next/navigation";
import ConfirmDialogComponent from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Button from "@/components/universals/forms/Button";
import {
  removePart
} from "@/app/(with-header)/material-tracing/[serviceId]/part/[partId]/_components/remove/PartRemove.server-action";

type PartRemoveProps = {
  partId: string;
  homeUrl: string;
};

const PartRemove: React.FunctionComponent<PartRemoveProps> = ({
  partId,
  homeUrl,
}) => {
  const openDialog = useOpenDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDialog(ConfirmDialogComponent, {
      text: 'Möchtest du diesen Part wirklich löschen?',
      successButtonText: 'Löschen',
      successButtonColor: '#BB0000',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removePart(partId);

    router.push(homeUrl);
  }, [partId, homeUrl]);

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
        Part löschen
      </Button>
    </Section>
  );
};

export default PartRemove;
