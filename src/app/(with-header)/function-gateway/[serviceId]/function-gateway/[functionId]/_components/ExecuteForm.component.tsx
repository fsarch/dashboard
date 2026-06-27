'use client';

import React, { useCallback, useState } from 'react';
import { Form, Formik } from "formik";
import TextArea from "@/components/universals/forms/TextArea";
import Select from "@/components/universals/forms/Select";
import Button from "@/components/universals/forms/Button";
import { executeFunctionAction } from "./ExecuteForm.server-action";

type ExecuteFormProps = {
  functionId: string;
};

const ExecuteForm: React.FunctionComponent<ExecuteFormProps> = ({ functionId }) => {
  const [result, setResult] = useState<{ success: boolean; result?: string; error?: string } | null>(null);

  const handleSubmit = useCallback(async (values: { method: string; input: string }) => {
    setResult(null);

    const response = await executeFunctionAction(functionId, values.method, values.input);
    setResult(response);
  }, [functionId]);

  return (
    <>
      <Formik
        initialValues={{
          method: 'GET',
          input: '{}',
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <Select
            name="method"
            values={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'OPTIONS', label: 'OPTIONS' },
              { value: 'HEAD', label: 'HEAD' },
            ]}
          />

          <TextArea name="input" />

          <Button type="submit">
            Execute
          </Button>
        </Form>
      </Formik>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: result.success ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
          {result.success ? (
            <>
              <h4>Ausführungsergebnis:</h4>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {result.result}
              </pre>
            </>
          ) : (
            <>
              <h4>Fehler:</h4>
              <p>{result.error}</p>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ExecuteForm;
