'use client';

import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';
import './monaco-setup';
import MonacoEditor from '@monaco-editor/react';

type JsonEditorProps = {
  name: string;
  height?: string;
};

/**
 * A Monaco JSON editor bound to a Formik field. The field's value is kept
 * as a raw JSON *string* (not a parsed object) - the surrounding form's
 * submit handler is responsible for `JSON.parse`-ing it and surfacing a
 * clear error if it isn't valid JSON, since dblight-server's own schema/
 * record validation errors are far more useful than anything Monaco can
 * tell you about the text alone.
 */
const JsonEditor: React.FunctionComponent<JsonEditorProps> = ({
  name,
  height = '320px',
}) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField<string>(name);

  const handleChange = useCallback(
    (value: string | undefined) => {
      setFieldValue(name, value ?? '');
    },
    [name, setFieldValue],
  );

  return (
    <div style={{ height, border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
      <MonacoEditor
        height="100%"
        defaultLanguage="json"
        defaultValue={field.value}
        onChange={handleChange}
        theme="vs-dark"
        options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
    </div>
  );
};

export default JsonEditor;
