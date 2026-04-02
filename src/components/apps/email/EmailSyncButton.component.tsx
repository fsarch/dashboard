'use client';

import React, { useCallback, useState } from 'react';
import Button from "@/components/universals/forms/Button";
import { syncEmailsAction } from '@/components/apps/email/EmailSync.server-action';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';

type EmailSyncButtonProps = {
  accountId: string;
};

const EmailSyncButton: React.FunctionComponent<EmailSyncButtonProps> = ({ accountId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const openDialog = useOpenDialog();

  const handleSync = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await syncEmailsAction(accountId);

      await openDialog(AlertDialog, {
        text: result.message,
      }).result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      await openDialog(AlertDialog, {
        text: message,
      }).result;
    } finally {
      setIsLoading(false);
    }
  }, [accountId, openDialog]);

  return (
    <Button
      type="button"
      onClick={handleSync}
      disabled={isLoading}
    >
      {isLoading ? '⟳ Synchronisierung läuft...' : '⟳ Emails synchronisieren'}
    </Button>
  );
};

export default EmailSyncButton;

