import React from "react";

import { DialogResult } from "@/components/universals/dialog/dialog.enum";

export type TDialogResult<TResult> = {
  status: DialogResult.SUCCESS,
  value: TResult,
} | {
  status: DialogResult.ERROR;
  error: Error;
} | {
  status: DialogResult.CANCEL;
};

export type TDialogComponent<TInput, TResult> = React.FC<{
  value: TInput;
  onResult: (result: TDialogResult<TResult>) => void;
}>

// Zusätzliche, von der Dialog-Komponente unabhängige Optionen für
// openDialog/useOpenDialog - aktuell nur die Overlay-Hintergrundfarbe, die
// für jeden Dialog (unabhängig von dessen konkreter Komponente) greift.
export type TOpenDialogOptions = {
  // Überschreibt die Standard-Hintergrundfarbe des Overlays für diesen einen
  // Dialog; ohne Angabe bleibt es beim bisherigen Grau (dialog.module.scss).
  color?: string;
};
