'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { useOpenDeleteDialog } from "@/components/universals/dialogs/confirm/useOpenDeleteDialog";
import { useRouter } from "next/navigation";
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
