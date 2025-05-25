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
