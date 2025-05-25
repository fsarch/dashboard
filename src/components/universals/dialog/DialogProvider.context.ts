import { createContext, useCallback, useContext } from "react";
import { TDialogComponent, TDialogResult } from "@/components/universals/dialog/dialog.type";

export type TDialog<T> = {
  id: string;
  result: Promise<TDialogResult<T>>;
  close: (result: TDialogResult<unknown>) => void;
};

export type TDialogProviderContext<TInput, TResult> = {
  openDialog: (component: TDialogComponent<TInput, TResult>, value: TInput) => TDialog<unknown>;
};

export const DialogProviderContext = createContext<TDialogProviderContext<unknown, unknown>>({
  openDialog: <TInput, TResult>(component: TDialogComponent<TInput, TResult>) => ({} as TDialog<TResult>),
});

export const useDialog = () => useContext(DialogProviderContext);
export const useOpenDialog = () => {
  const { openDialog } = useDialog();

  return useCallback(<TInput, TResult>(
    component: TDialogComponent<TInput, TResult>,
    input: TInput,
  ): TDialog<TResult> => {
    return openDialog(
      component as TDialogComponent<unknown, unknown>,
      input,
    ) as TDialog<TResult>;
  }, [openDialog]);
};
