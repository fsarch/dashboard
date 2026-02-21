'use client'

import React, { useState } from 'react';
import styles from './ConversationStarter.module.scss';
import Button from '@/components/universals/forms/Button';

type Props = {
  onStart?: (initialMessage: string) => void;
}

const ConversationStarter: React.FC<Props> = ({ onStart }) => {
  const [value, setValue] = useState('');

  const handleStart = () => {
    if (!value.trim()) return;
    onStart?.(value.trim());
    setValue('');
  };

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <h3 className={styles.title}>Starte eine neue Konversation</h3>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Stelle eine Frage oder gib ein Prompt ein..."
          />
          <Button type="button" onClick={handleStart}>Start</Button>
        </div>
      </div>
    </div>
  );
}

export default ConversationStarter;
