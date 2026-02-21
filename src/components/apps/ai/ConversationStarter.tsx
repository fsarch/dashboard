'use client'

import React, { useState } from 'react';
import styles from './ConversationStarter.module.scss';
import Button from '@/components/universals/forms/Button';
import AiIcon from "@/components/apps/ai/icons/AiIcon";

type Props = {
  serviceId?: string;
  // server action expects FormData when used as a form action
  onStart?: (formData: FormData) => Promise<any> | any;
}

const ConversationStarter: React.FC<Props> = ({ serviceId, onStart }) => {
  const [value, setValue] = useState('');

  // If onStart is provided (a server action), we render a form that posts to it.
  // Otherwise, we fall back to client behavior (no-op).
  if (onStart) {
    return (
      <div className={styles.center}>
        <div className={styles.card}>
          <div className={styles.titleWrapper}>
            <AiIcon className={styles.aiIcon} enableAnimation/>
            <h3 className={styles.title}>Starte eine neue Konversation</h3>
          </div>
          <form action={onStart as any} className={styles.inputRow}>
            <input name="initialMessage" className={styles.input} defaultValue={value} placeholder="Stelle eine Frage oder gib ein Prompt ein..." />
            <Button type="submit">Start</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <h3 className={styles.title}>Starte eine neue Konversation</h3>
        <div className={styles.inputRow}>
          <input className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Stelle eine Frage oder gib ein Prompt ein..." />
          <Button type="button" onClick={() => console.warn('No onStart provided')}>Start</Button>
        </div>
      </div>
    </div>
  );
}

export default ConversationStarter;
