'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';

type DangerZoneDeleteProps = {
  confirmText: string;
  buttonText?: string;
  redirectUrl: string;
  onDelete: () => Promise<void>;
};

const DangerZoneDelete: React.FunctionComponent<DangerZoneDeleteProps> = ({
  confirmText,
  buttonText = 'Löschen',
  redirectUrl,
  onDelete,
}) => {
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback(async () => {
    const dialogResult = await openDeleteDialog({
      text: confirmText,
      successButtonText: buttonText,
    }).result;

    if (dialogResult.status !== DialogResult.SUCCESS) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      router.push(redirectUrl);
    } finally {
      setIsDeleting(false);
    }
  }, [
    confirmText,
    buttonText,
    onDelete,
    redirectUrl,
    router,
    openDeleteDialog,
  ]);

  return (
    <Section name="Danger Zone" color="#FF0000">
      <Button
        type="button"
        onClick={handleDeleteClick}
        color="#BB0000"
        disabled={isDeleting}
      >
        {buttonText}
      </Button>
    </Section>
  );
};

export default DangerZoneDelete;
