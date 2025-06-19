'use client';

import React, { useCallback, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import dynamic from "next/dynamic";
import loader from '@monaco-editor/loader';
import Button from "@/components/universals/forms/Button";
import {
  publishCode,
  saveCode
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/Editor.server-action";
import { useRouter } from "next/navigation";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import TestFunctionDialog
  from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/dialog/TestFunction.dialog";
import IconButtonContent from '@/components/universals/forms/button/IconButtonContent';
import styles from './Editor.module.scss';

loader.config({
  paths: {
    vs: `${(typeof window !== 'undefined' ? window.location.origin : '')}/assets/monaco/vs`,
  },
  "vs/nls": {
    availableLanguages: {
      "*": "de" // on the editor, press right click to see the German words
    }
  },
});


type EditorProps = {
  value: string;
  functionId: string;
  versionId?: string;
};

const Editor: React.FunctionComponent<EditorProps> = ({
  value,
  functionId,
  versionId,
}) => {
  const valueRef = useRef<string | null>(null);

  const handleChange = useCallback((value: string | undefined) => {
    if (!value) {
      return;
    }

    valueRef.current = value;
  }, []);

  const handleSave = useCallback(async () =>  {
    const code = valueRef.current;

    if (code === null) {
      return;
    }

    await saveCode(functionId, code);
  }, [functionId]);

  const router = useRouter();

  const handlePublish = useCallback(async () =>  {
    const code = valueRef.current;
    if (code !== null) {
      await saveCode(functionId, code);
    }

    await publishCode(functionId);

    router.refresh();
  }, [functionId, router]);

  const openDialog = useOpenDialog();

  const handleTest = useCallback(async () => {
    if (!versionId) {
      return;
    }

    openDialog(TestFunctionDialog, {
      versionId,
      functionId,
    })
  }, [functionId, versionId]);

  return (
    <>
      <div
        className={styles.toolbar}
      >
        <div
          className={styles.toolbarGroup}
        >
          <Button
            type="button"
            onClick={handleSave}
            color="#2f609f"
          >
            <IconButtonContent
              icon="floppy-disk"
            >
              Speichern
            </IconButtonContent>
          </Button>
          <Button
            type="button"
            onClick={handleTest}
            color="#2F9F38"
          >
            <IconButtonContent
              icon="flask-vial"
            >
              Testen
            </IconButtonContent>
          </Button>
        </div>
        <div className={styles.space} />
        <div
          className={styles.toolbarGroup}
        >
          <Button
            type="button"
            onClick={handlePublish}
            color="#c45c16"
          >
            <IconButtonContent
              icon="cloud-arrow-up"
            >
              Veröffentlichen
            </IconButtonContent>
          </Button>
        </div>
      </div>
      <MonacoEditor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={value}
        onChange={handleChange}
        theme="vs-dark"
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(Editor), {
  ssr: false,
});
