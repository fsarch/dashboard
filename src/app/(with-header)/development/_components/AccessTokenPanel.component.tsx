'use client';

import React from 'react';
import Button from '@/components/universals/forms/Button';

type AccessTokenPanelProps = {
  accessToken: string;
};

const AccessTokenPanel: React.FunctionComponent<AccessTokenPanelProps> = ({
  accessToken,
}) => {
  const [copyState, setCopyState] = React.useState<'idle' | 'success' | 'error'>('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(accessToken);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => setCopyState('idle'), 2000);
  }

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <Button type="button" onClick={handleCopy}>Access-Token kopieren</Button>
        {copyState === 'success' ? <span style={{ marginLeft: '12px' }}>Kopiert</span> : null}
        {copyState === 'error' ? <span style={{ marginLeft: '12px' }}>Kopieren fehlgeschlagen</span> : null}
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
        {accessToken}
      </pre>
    </div>
  );
};

export default AccessTokenPanel;

