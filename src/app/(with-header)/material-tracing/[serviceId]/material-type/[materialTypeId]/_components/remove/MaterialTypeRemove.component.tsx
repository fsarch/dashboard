'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { useOpenDeleteDialog } from "@/components/universals/dialogs/confirm/useOpenDeleteDialog";
import { useRouter } from "next/navigation";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Button from "@/components/universals/forms/Button";
import {
  removeManufacturer
} from "@/app/(with-header)/material-tracing/[serviceId]/manufacturer/[manufacturerId]/_components/remove/ManufacturerRemove.server-action";
import {
  removeMaterialType
} from "@/app/(with-header)/material-tracing/[serviceId]/material-type/[materialTypeId]/_components/remove/MaterialTypeRemove.server-action";

type MaterialTypeRemoveProps = {
  materialTypeId: string;
  homeUrl: string;
};

const MaterialTypeRemove: React.FunctionComponent<MaterialTypeRemoveProps> = ({
  materialTypeId,
  homeUrl,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDeleteDialog({
      text: 'Möchtest du diesen MaterialType wirklich löschen?',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeMaterialType(materialTypeId);

    router.push(homeUrl);
  }, [materialTypeId, homeUrl]);

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
        MaterialType löschen
      </Button>
    </Section>
  );
};

export default MaterialTypeRemove;
