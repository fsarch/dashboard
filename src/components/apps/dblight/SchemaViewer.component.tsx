'use client';

import React from 'react';
import './monaco-setup';
import MonacoEditor from '@monaco-editor/react';

type SchemaViewerProps = {
  schema: Record<string, unknown>;
};

/**
 * Read-only Monaco view of a collection's active JSON schema. Split out of
 * `CollectionDetail` so it can be loaded with `next/dynamic({ ssr: false })`
 * there - see `RecordForm.component.tsx` for why `monaco-editor` must never
 * be evaluated during server rendering.
 */
const SchemaViewer: React.FunctionComponent<SchemaViewerProps> = ({ schema }) => (
  <div style={{ height: '320px', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
    <MonacoEditor
      height="100%"
      defaultLanguage="json"
      value={JSON.stringify(schema, null, 2)}
      theme="vs-dark"
      options={{ readOnly: true, domReadOnly: true, minimap: { enabled: false } }}
    />
  </div>
);

export default SchemaViewer;
