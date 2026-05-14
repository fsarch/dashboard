'use client';

import React, { useCallback, useState } from 'react';
import Button from '@/components/universals/forms/Button';
import styles from './ShortCodeCopyButton.module.scss';

type ShortCodeCopyButtonProps = {
  value: string;
};

const ShortCodeCopyButton: React.FunctionComponent<ShortCodeCopyButtonProps> = ({
  value,
}) => {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => setCopyState('idle'), 1800);
  }, [value]);

  return (
    <div className={styles.root}>
      <Button type="button" onClick={handleCopy}>
        ShortCode kopieren
      </Button>
      {copyState === 'success' ? <span className={styles.feedback}>Kopiert</span> : null}
      {copyState === 'error' ? <span className={styles.feedbackError}>Fehler beim Kopieren</span> : null}
    </div>
  );
};

export default ShortCodeCopyButton;

