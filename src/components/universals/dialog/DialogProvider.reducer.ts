import { TDialogComponent, TDialogResult } from "@/components/universals/dialog/dialog.type";

type TReducerAddAction<TInput, TResult> = {
  type: 'add',
  payload: TReducerDialog<TInput, TResult>,
};

type TReducerCloseAction<TResult> = {
  type: 'close',
  payload: {
    id: string;
    result: TDialogResult<TResult>;
  },
};

export type TReducerDialog<TInput, TResult> = {
  id: string;
  component: TDialogComponent<TInput, TResult>,
  value: TInput,
  promise: {
    value: Promise<TDialogResult<TResult>>;
    resolve: (value: TDialogResult<TResult>) => void;
    reject: (error: Error) => void;
  };
};

export function DialogReducer(
  state: { dialogs: Array<TReducerDialog<unknown, unknown>>; },
  action: TReducerAddAction<unknown, unknown> | TReducerCloseAction<unknown>,
) {
  switch (action.type) {
    case "add":
      return {
        ...state,
        dialogs: [...state.dialogs, action.payload],
      };
    case "close": {
      const foundDialog = state.dialogs.find(d => d.id === action.payload.id);
      if (!foundDialog) {
        return state;
      }

      foundDialog.promise.resolve(action.payload.result);

      return {
        ...state,
        dialogs: state.dialogs.filter(d => d.id !== action.payload.id),
      };
    }
  }
}
