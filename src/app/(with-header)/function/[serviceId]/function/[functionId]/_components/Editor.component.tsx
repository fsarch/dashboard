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
      <div>
        <Button
          type="button"
          onClick={handleTest}
        >
          Testen
        </Button>
        <Button
          type="button"
          onClick={handleSave}
        >
          Speichern
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
        >
          Veröffentlichen
        </Button>
      </div>
      <MonacoEditor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={value}
        onChange={handleChange}
      >

      </MonacoEditor>
    </>
  );
};

export default dynamic(() => Promise.resolve(Editor), {
  ssr: false,
});
