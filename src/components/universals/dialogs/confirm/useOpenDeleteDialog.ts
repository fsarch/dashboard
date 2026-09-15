'use client';

import { useCallback } from 'react';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { TDialog } from '@/components/universals/dialog/DialogProvider.context';
import ConfirmDialogComponent from './ConfirmDialog.component';

export type TOpenDeleteDialogValue = {
  text: string;
  successButtonText?: string;
};

// Rot statt der ConfirmDialog-Standardfarben, damit jede Lösch-/Entfernen-
// Bestätigung in der App optisch konsistent als gefährliche Aktion zu
// erkennen ist (Overlay + Bestätigen-Button), ohne dass jede Call-Site
// diese beiden Werte selbst wiederholen muss.
const DELETE_BUTTON_COLOR = '#BB0000';
const DELETE_OVERLAY_COLOR = 'rgba(187, 0, 0, 0.12)';

// Vorkonfigurierter ConfirmDialog für Lösch-/Entfernen-Bestätigungen, siehe
// useOpenDialog für die generische Variante.
export const useOpenDeleteDialog = () => {
  const openDialog = useOpenDialog();

  return useCallback((value: TOpenDeleteDialogValue): TDialog<void> => {
    return openDialog(
      ConfirmDialogComponent,
      {
        text: value.text,
        successButtonText: value.successButtonText ?? 'Löschen',
        successButtonColor: DELETE_BUTTON_COLOR,
      },
      { color: DELETE_OVERLAY_COLOR },
    );
  }, [openDialog]);
};
