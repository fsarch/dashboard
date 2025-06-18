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

type TestFunctionDialogType = TDialogComponent<{ functionId: string; versionId: string; }, void>;

const DEFAULT_VALUE = '[\n\t"Hello World"\n]';

const TestFunctionDialog: TestFunctionDialogType = ({
  value,
  onResult,
}) => {
  const [requestArgs, setRequestArgs] = useState<string>(DEFAULT_VALUE);
  const [result, setResult] = useState<{ result: unknown } | null>(null);

  const handleRunTest = useCallback(async () => {
    const args = JSON.parse(requestArgs);
    if (!args || !Array.isArray(args)) {
      throw new Error('invalid provided body');
    }

    console.log('run test', value.functionId, value.versionId, args);

    const response = await executeFunction(value.functionId, value.versionId, {
      args
    });

    console.log('response', response);

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
      <div>
        <Editor
          defaultLanguage="json"
          defaultValue={DEFAULT_VALUE}
          onChange={handleChange}
          height="20vh"
          width="50vw"
        />
      </div>
      {result ? (
        <div className={styles.resultData}>
          <pre>
            {JSON.stringify(result.result, null, 2)}
          </pre>
        </div>
      ) : null}
      <div>
        <Button
          type="button"
          onClick={handleRunTest}
        >
          Ausführen
        </Button>
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
