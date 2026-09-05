'use client';

import React, { useCallback, useRef, KeyboardEvent } from 'react';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import dynamic from "next/dynamic";
import loader from '@monaco-editor/loader';
import {
  publishCode,
  saveCode
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/Editor.server-action";
import { useRouter } from "next/navigation";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import TestFunctionDialog
  from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/dialog/TestFunction.dialog";
import styles from './Editor.module.scss';
import IconButton from "@/components/universals/forms/button/IconButton";
import IconActionButton from "@/components/universals/forms/button/IconActionButton";
import Badge from "@/components/universals/badge/badge.component";
import { colors } from "@/app/_styles/colors";
import { useLoadingState } from "@/components/universals/forms/button/useLoadingState";
import InlineLoadingWrapper from "@/components/universals/forms/button/InlineLoadingWrapper";
import {
  API_EXTRA_LIBS,
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/editor-types/definitions.generated";

loader.config({
  monaco,
});

type EditorProps = {
  value: string;
  functionId: string;
  versionId?: string;
  apiType: string;
  /** Shows the code of a version without allowing it to be saved or published. */
  readOnly?: boolean;
};

const Editor: React.FunctionComponent<EditorProps> = ({
  value,
  functionId,
  versionId,
  apiType,
  readOnly = false,
}) => {
  const valueRef = useRef<string | null>(null);

  const handleChange = useCallback((value: string | undefined) => {
    if (!value) {
      return;
    }

    valueRef.current = value;
  }, []);

  const handleSaveIntern = useCallback(async () =>  {
    const code = valueRef.current;

    if (code === null) {
      return;
    }

    await saveCode(functionId, code);
  }, [functionId]);
  const [isSaving, handleSave] = useLoadingState(handleSaveIntern);

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
  }, [functionId, versionId, openDialog]);

  const handleMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editor.onDidFocusEditorText(() => {
      monaco.languages.typescript.javascriptDefaults.setExtraLibs([
        {
          content: `
            declare interface FsArchApi {
            }
        
            declare var fsarch: FsArchApi;
          `,
          filePath: 'api.d.ts',
        },
        ...API_EXTRA_LIBS,
        {
          // content: `
          // declare interface FsArchApi {
          //    pdf: FsArchApiCatalog.${API_SERVICES['pdf-server']};
          // }
          // `,
          content: apiType,
          filePath: 'custom-api.d.ts',
        },
      ]);
    });
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) {
      return;
    }

    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    if (event.key === 's') {
      event.preventDefault();
      handleSave();
    }
  }

  return (
    <div
      className={styles.root}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.toolbar}
      >
        <div
          className={styles.toolbarGroup}
        >
          {readOnly ? (
            <Badge color={colors.lightBlue}>Nur Ansicht</Badge>
          ) : (
            <InlineLoadingWrapper isLoading={isSaving}>
              <IconButton
                type="button"
                onClick={handleSave}
                color={colors.lightBlue}
                icon="floppy-disk"
              >
                Speichern
              </IconButton>
            </InlineLoadingWrapper>
          )}
          <IconButton
            type="button"
            onClick={handleTest}
            color={colors.lightGreen}
            icon="flask-vial"
          >
            Testen
          </IconButton>
        </div>
        <div className={styles.space} />
        {!readOnly && (
          <div
            className={styles.toolbarGroup}
          >
            <IconActionButton
              type="button"
              onClick={handlePublish}
              color={colors.orange}
              icon="cloud-arrow-up"
            >
              Veröffentlichen
            </IconActionButton>
          </div>
        )}
      </div>
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={value}
        onChange={handleChange}
        theme="vs-dark"
        onMount={handleMount}
        options={{ readOnly, domReadOnly: readOnly }}
      />
    </div>
  );
};

export default Editor;
