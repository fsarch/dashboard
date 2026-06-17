'use client';

import React from 'react';
import {
  TEvaluationDebugInfo, TGeneratedFormInitialValues,
  TGeneratedFormInput
} from '@/components/universals/forms/generated/GeneratedForm.type';

type DevDataSourcesSectionProps = {
  definition: Array<TGeneratedFormInput>;
  debugInfo?: TEvaluationDebugInfo;
  initialValues: TGeneratedFormInitialValues;
};

const DevDataSourcesSection: React.FunctionComponent<DevDataSourcesSectionProps> = ({
  definition,
  debugInfo,
  initialValues,
}) => {
  const [copyState, setCopyState] = React.useState<'idle' | 'success' | 'error'>('idle');

  const dataAsJson = React.useMemo(() => JSON.stringify({
    definition,
    debugInfo,
    initialValues,
  }, null, 2), [definition, debugInfo, initialValues]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(dataAsJson);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => setCopyState('idle'), 2000);
  }

  return (
    <details style={{ marginBottom: '16px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <summary style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <span><strong>Dev: DataSources anzeigen</strong></span>
        <button type="button" onClick={(e) => { e.preventDefault(); handleCopy(); }}>
          DataSources kopieren
        </button>
        {copyState === 'success' ? <span>Kopiert</span> : null}
        {copyState === 'error' ? <span>Kopieren fehlgeschlagen</span> : null}
      </summary>
      <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', marginTop: '8px' }}>
        {dataAsJson}
      </pre>
    </details>
  );
};

export default DevDataSourcesSection;
