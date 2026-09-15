'use client';

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import Button from "@/components/universals/forms/Button";
import { removeItem } from "@/components/apps/product/item/remove/ItemRemove.server-action";
import { useOpenDeleteDialog } from "@/components/universals/dialogs/confirm/useOpenDeleteDialog";
import { useRouter } from "next/navigation";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";

type ItemRemoveProps = {
  catalogId: string;
  itemId: string;
  homeUrl: string;
};

const ItemRemove: React.FunctionComponent<ItemRemoveProps> = ({
  itemId,
  catalogId,
  homeUrl,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();

  const router = useRouter();

  const handleDeleteClick = useCallback(async () => {
    const dialogRes = await openDeleteDialog({
      text: 'Möchtest du diesen Eintrag wirklich löschen?',
    }).result;
    if (dialogRes.status !== DialogResult.SUCCESS) {
      return;
    }

    await removeItem(catalogId, itemId);

    router.push(homeUrl);
  }, [itemId, homeUrl]);

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
        Eintrag löschen
      </Button>
    </Section>
  );
};

export default ItemRemove;
