'use client'

import React, { useMemo, useState } from 'react';
import styles from './ChatPanel.module.scss';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Section from '@/components/universals/section/Section';
import Button from '@/components/universals/forms/Button';

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

const mockConversations: Array<{ id: string; title: string; messages: ChatMessage[] }> = [
  {
    id: 'conv-1',
    title: 'Fragen zum Produkt-Import',
    messages: [
      { id: 'm1', role: 'user', text: 'Wie importiere ich die CSV-Datei?' },
      { id: 'm2', role: 'assistant', text: 'Du kannst die Datei über das Import-Tool hochladen...' },
    ],
  },
  {
    id: 'conv-2',
    title: 'Preisberechnung',
    messages: [
      { id: 'm1', role: 'user', text: 'Wie berechne ich den Endpreis?' },
      { id: 'm2', role: 'assistant', text: 'Berücksichtige Margen, Steuern und Versandkosten.' },
    ],
  },
];

type ChatPanelProps = {
  serviceId: string;
};

const ChatPanel: React.FunctionComponent<ChatPanelProps> = ({ serviceId }) => {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversations[0]?.id ?? null);
  const [input, setInput] = useState('');

  const activeConversation = useMemo(() => conversations.find((c) => c.id === activeConversationId) ?? null, [conversations, activeConversationId]);

  const startNewConversation = () => {
    const id = `conv-${Date.now()}`;
    const newConvMessages: ChatMessage[] = [{ id: `m-${Date.now()}`, role: 'user', text: input }];
    const newConv = { id, title: input || 'Neue Konversation', messages: newConvMessages };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(id);
    setInput('');
  };

  const sendMessage = () => {
    if (!activeConversation || !input.trim()) return;
    const message: ChatMessage = { id: `m-${Date.now()}`, role: 'user', text: input };
    const assistant: ChatMessage = { id: `m-${Date.now()}-a`, role: 'assistant', text: 'Antwort (Platzhalter) ...' };
    setConversations((prev) => prev.map((c) => c.id === activeConversation.id ? { ...c, messages: [...c.messages, message, assistant] } : c));
    setInput('');
  };

  return (
    <div className={styles.root} data-service-id={serviceId}>
      <div className={styles.sidebar}>
        <Section name="Konversationen">
          <List>
            {conversations.map((conv) => (
              <ListItem key={conv.id} left={null} right={null}>
                <button className={styles.convButton} onClick={() => setActiveConversationId(conv.id)}>{conv.title}</button>
              </ListItem>
            ))}
          </List>
          <div className={styles.newConv}>
            <input
              className={styles.newConvInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Neue Konversation starten"
            />
            <Button type="button" onClick={startNewConversation}>Start</Button>
          </div>
        </Section>
      </div>
      <div className={styles.chatArea}>
        {activeConversation ? (
          <div>
            <h2>{activeConversation.title}</h2>
            <div className={styles.messages}>
              {activeConversation.messages.map((m) => (
                <div key={m.id} className={styles.message + ' ' + (m.role === 'user' ? styles.user : styles.assistant)}>
                  <div className={styles.role}>{m.role}</div>
                  <div className={styles.text}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className={styles.sendRow}>
              <input className={styles.sendInput} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nachricht eingeben..." />
              <Button type="button" onClick={sendMessage}>Senden</Button>
            </div>
          </div>
        ) : (
          <div>Wähle eine Konversation oder starte eine neue.</div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;

