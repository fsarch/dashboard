'use client';

import React, { useCallback, useState } from 'react';
import Section from '@/components/universals/section/Section';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import ConfirmDialogComponent from '@/components/universals/dialogs/confirm/ConfirmDialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useRouter } from 'next/navigation';

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
  const openDialog = useOpenDialog();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback(async () => {
    const dialogResult = await openDialog(ConfirmDialogComponent, {
      text: confirmText,
      successButtonText: buttonText,
      successButtonColor: '#BB0000',
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
  }, [confirmText, buttonText, onDelete, redirectUrl, router, openDialog]);

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
