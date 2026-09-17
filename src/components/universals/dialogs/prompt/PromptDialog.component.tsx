'use client';

import React, { useCallback, useId, useState } from 'react';
import clsx from 'clsx';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import DialogTitle from "@/components/universals/dialog/DialogTitle.component";
import DialogContent from "@/components/universals/dialog/DialogContent.component";
import DialogButtons from "@/components/universals/dialog/DialogButtons.component";
import Button from "@/components/universals/forms/Button";
import inputStyles from '@/components/universals/forms/Input.module.scss';
import styles from './PromptDialog.module.scss';

export type TPromptDialogValue = {
  title?: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
  submitButtonText?: string;
};

// Generic single-line text-input dialog - anywhere a small "please enter a
// name/value" prompt is needed (e.g. creating a new drive folder), instead of
// building a one-off dialog component for it. Resolves with the entered
// string, or DialogResult.CANCEL if the user backs out.
type PromptDialogType = TDialogComponent<TPromptDialogValue, string>;

const PromptDialog: PromptDialogType = ({
  value,
  onResult,
}) => {
  const id = useId();
  const [text, setText] = useState(value.initialValue ?? '');
  const required = value.required ?? true;
  const isValid = !required || text.trim().length > 0;

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    onResult({ status: DialogResult.SUCCESS, value: text });
  }, [isValid, text, onResult]);

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        {value.title ? <DialogTitle>{value.title}</DialogTitle> : null}
        <DialogContent enableBottomPadding={false}>
          {value.label ? <label htmlFor={id}>{value.label}</label> : null}
          <input
            id={id}
            className={clsx(inputStyles.root, styles.input)}
            type="text"
            value={text}
            placeholder={value.placeholder}
            autoFocus
            onChange={(event) => setText(event.target.value)}
          />
        </DialogContent>
        <DialogButtons>
          <Button type="submit" disabled={!isValid}>
            {value.submitButtonText ?? 'Bestätigen'}
          </Button>
          <Button type="button" onClick={() => onResult({ status: DialogResult.CANCEL })}>
            Abbrechen
          </Button>
        </DialogButtons>
      </form>
    </Dialog>
  );
};

export default PromptDialog;
