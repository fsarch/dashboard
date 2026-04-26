'use client';

import React from 'react';
import Section from '@/components/universals/section/Section';

type DevResponseSectionProps = {
  title: string;
  response: unknown;
};

const DevResponseSection: React.FunctionComponent<DevResponseSectionProps> = ({
  title,
  response,
}) => {
  const [copyState, setCopyState] = React.useState<'idle' | 'success' | 'error'>('idle');
  const responseAsJson = React.useMemo(() => JSON.stringify(response, null, 2), [response]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(responseAsJson);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => setCopyState('idle'), 2000);
  }

  return (
    <Section name={`Dev: ${title}`}>
      <details>
        <summary style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>Response anzeigen</span>
          <button type="button" onClick={handleCopy}>
            Response kopieren
          </button>
          {copyState === 'success' ? <span>Kopiert</span> : null}
          {copyState === 'error' ? <span>Kopieren fehlgeschlagen</span> : null}
        </summary>
        <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
          {responseAsJson}
        </pre>
      </details>
    </Section>
  );
};

export default DevResponseSection;
