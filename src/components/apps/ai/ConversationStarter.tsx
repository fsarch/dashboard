'use client'

import React, { useState } from 'react';
import Section from '@/components/universals/section/Section';
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
    <Section name="Neue Konversation">
      <div className="ai-start-row" style={{ display: 'flex', gap: 8 }}>
        <input
          className="newConvInput"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Stelle eine Frage oder gib ein Prompt ein..."
        />
        <Button type="button" onClick={handleStart}>Start</Button>
      </div>
    </Section>
  );
}

export default ConversationStarter;
