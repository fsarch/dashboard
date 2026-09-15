'use client';

import React, { useCallback, useState } from 'react';
import * as monaco from 'monaco-editor';
import loader from '@monaco-editor/loader';
import { Editor } from '@monaco-editor/react';
import { TDialogComponent } from '@/components/universals/dialog/dialog.type';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import Dialog from '@/components/universals/dialog/dialog.component';
import Button from '@/components/universals/forms/Button';
import styles from './CodeEditorDialog.module.scss';

// Use the bundled monaco-editor package instead of Monaco's default
// CDN-loaded copy - same setup as function/[functionId]/_components/
// Editor.component.tsx. A no-op if that module already ran this (loader's
// config is a module-level singleton), harmless either way.
loader.config({ monaco });

export type TCodeEditorDialogValue = {
  // Any Monaco language id ("html", "javascript", "css", "json", ...) -
  // this dialog is deliberately generic, not HTML-specific.
  language: string;
  code: string;
  title?: string;
  readOnly?: boolean;
};

type CodeEditorDialogType = TDialogComponent<TCodeEditorDialogValue, string>;

// A large, general-purpose "edit source code" dialog - the code-editing
// equivalent of ConfirmDialog/AlertDialog (same useOpenDialog()/Dialog
// plumbing, see dialog.type.ts), for whenever a value is source code
// rather than something better edited inline (a small textarea forces
// wrapping/scrolling that makes HTML, JSON, JS, etc. hard to actually
// read or edit). Opened like any other dialog:
//
//   const openDialog = useOpenDialog();
//   const { result } = openDialog(CodeEditorDialog, { language: 'html', code });
//   if (result.status === DialogResult.SUCCESS) onChange(result.value);
const CodeEditorDialog: CodeEditorDialogType = ({ value, onResult }) => {
  const [code, setCode] = useState(value.code);

  const handleChange = useCallback((next: string | undefined) => {
    setCode(next ?? '');
  }, []);

  return (
    <Dialog>
      {value.title && <div className={styles.title}>{value.title}</div>}
      <div className={styles.editorWrapper}>
        <Editor
          defaultLanguage={value.language}
          defaultValue={value.code}
          onChange={handleChange}
          height="100%"
          width="100%"
          theme="vs-dark"
          options={{ readOnly: value.readOnly, domReadOnly: value.readOnly, minimap: { enabled: false } }}
        />
      </div>
      <div className={styles.buttons}>
        <Button type="button" onClick={() => onResult({ status: DialogResult.CANCEL })}>
          Abbrechen
        </Button>
        {!value.readOnly && (
          <Button type="button" color="#2F609F" onClick={() => onResult({ status: DialogResult.SUCCESS, value: code })}>
            Übernehmen
          </Button>
        )}
      </div>
    </Dialog>
  );
};

export default CodeEditorDialog;
