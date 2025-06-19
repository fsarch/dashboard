import React, { useCallback, useState } from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import Button from "@/components/universals/forms/Button";
import { Editor } from "@monaco-editor/react";
import {
  executeFunction
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/dialog/TestFunction.server-action";
import styles from './TestFunction.module.scss';
import IconActionButton from "@/components/universals/forms/button/IconActionButton";
import TestFunctionResult
  from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/dialog/TestFunctionResult.component";
import {
  TestFunctionResultType
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/dialog/TestFunction.type";
import { colors } from "@/app/_styles/colors";

type TestFunctionDialogType = TDialogComponent<{ functionId: string; versionId: string; }, void>;

const DEFAULT_VALUE = '[\n\t"Hello World"\n]';

const TestFunctionDialog: TestFunctionDialogType = ({
  value,
  onResult,
}) => {
  const [requestArgs, setRequestArgs] = useState<string>(DEFAULT_VALUE);
  const [result, setResult] = useState<TestFunctionResultType | null>(null);

  const handleRunTest = useCallback(async () => {
    const args = JSON.parse(requestArgs);
    if (!args || !Array.isArray(args)) {
      throw new Error('invalid provided body');
    }

    const response = await executeFunction(value.functionId, value.versionId, {
      args
    });

    setResult(response);
  }, [value.versionId, value.functionId]);

  const handleChange = useCallback((value: string | undefined) => {
    if (!value) {
      return;
    }

    setRequestArgs(value);
  }, [setRequestArgs]);

  return (
    <Dialog>
      <div
        className={styles.editorWrapper}
      >
        <Editor
          defaultLanguage="json"
          defaultValue={DEFAULT_VALUE}
          onChange={handleChange}
          height="100%"
          width="100%"
          theme="vs-dark"
        />
      </div>
      {result ? (
        <TestFunctionResult
          result={result}
        />
      ) : null}
      <div
        className={styles.buttonWrapper}
      >
        <IconActionButton
          type="button"
          onClick={handleRunTest}
          color={colors.lightGreen}
          icon="play"
        >
          Ausführen
        </IconActionButton>
        <Button
          type="button"
          onClick={() => onResult({ status: DialogResult.CANCEL })}
        >
          Schließen
        </Button>
      </div>
    </Dialog>
  );
};

export default TestFunctionDialog;
