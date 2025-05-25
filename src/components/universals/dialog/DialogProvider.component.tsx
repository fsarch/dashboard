'use client';

import React, { PropsWithChildren, useCallback, useMemo, useReducer } from 'react';
import {
  DialogProviderContext,
  TDialog,
  TDialogProviderContext
} from "@/components/universals/dialog/DialogProvider.context";
import { TDialogComponent, TDialogResult } from "@/components/universals/dialog/dialog.type";
import { createDeferredPromise } from "@/utils/createDeferredPromise";
import DialogProviderDialog from "@/components/universals/dialog/DialogProviderDialog.component";
import { DialogReducer, TReducerDialog } from "@/components/universals/dialog/DialogProvider.reducer";

type DialogProviderProps = {

};

const DialogProvider: React.FunctionComponent<
  PropsWithChildren<DialogProviderProps>
> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(DialogReducer, { dialogs: [], });

  const handleOpenDialog = useCallback(<TInput = unknown, TResult = unknown>(
    component: TDialogComponent<TInput, TResult>,
    value: TInput,
  ): TDialog<TResult> => {
    const promise = createDeferredPromise<TDialogResult<TResult>>();

    const reducerDialog: TReducerDialog<TInput, TResult> = {
      id: crypto.randomUUID(),
      component,
      value,
      promise,
    };

    dispatch({
      type: 'add',
      payload: reducerDialog as TReducerDialog<unknown, unknown>,
    });

    return {
      id: reducerDialog.id,
      result: reducerDialog.promise.value as Promise<TDialogResult<TResult>>,
      close: (result: TDialogResult<unknown>) => {
        dispatch({
          type: 'close',
          payload: {
            id: reducerDialog.id,
            result,
          },
        })
      },
    };
  }, [dispatch]);

  const dialogProviderContext = useMemo((): TDialogProviderContext<unknown, unknown> => ({
    openDialog: handleOpenDialog,
  }), [handleOpenDialog]);

  const handleDialogResult = useCallback((
    id: string,
    result: TDialogResult<unknown>,
  ) => {
    dispatch({
      type: 'close',
      payload: {
        id,
        result,
      },
    });
  }, [dispatch]);

  return (
    <DialogProviderContext
      value={dialogProviderContext}
    >
      <DialogProviderDialog
        value={state.dialogs?.[0]}
        onResult={handleDialogResult}
      />
      {children}
    </DialogProviderContext>
  );
};

export default DialogProvider;
