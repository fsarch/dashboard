'use client'

import React, { useMemo, useState, useLayoutEffect, useRef } from 'react';
import Color from 'color';
import styles from './ChatPanel.module.scss';
import Button from '@/components/universals/forms/Button';

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

const mockConversations: Array<{ id: string; title: string; messages: ChatMessage[] }> = [
  {
    id: 'conv-1',
    title: 'Fragen zum Produkt-Import (Test-Long)',
    messages: [
      { id: 'm1', role: 'user', text: 'Wie importiere ich die CSV-Datei?' },
      { id: 'm2', role: 'assistant', text: 'Du kannst die Datei über das Import-Tool hochladen.' },
      { id: 'm3', role: 'user', text: 'Welche Spalten sind erforderlich?' },
      { id: 'm4', role: 'assistant', text: 'Mindestens SKU, Name und Preis.' },
      { id: 'm5', role: 'user', text: 'Gibt es ein Beispielformat?' },
      { id: 'm6', role: 'assistant', text: 'Ja, siehe unsere Dokumentation — wir unterstützen Semikolon- oder Komma-getrennte Dateien.' },
      { id: 'm7', role: 'user', text: 'Können Sonderzeichen wie ä/ö/ü auftauchen?' },
      { id: 'm8', role: 'assistant', text: 'Ja, UTF-8 wird empfohlen.' },
      { id: 'm9', role: 'user', text: 'Wie behandelt das System fehlende Preise?' },
      { id: 'm10', role: 'assistant', text: 'Fehlende Preise werden als Fehler markiert und nicht importiert.' },
      { id: 'm11', role: 'user', text: 'Kann ich Bulk-Updates durchführen?' },
      { id: 'm12', role: 'assistant', text: 'Ja, über denselben Importmechanismus mit Update-Flag.' },
      { id: 'm13', role: 'user', text: 'Wie lange dauert ein großer Import (100k Zeilen)?' },
      { id: 'm14', role: 'assistant', text: 'Das hängt vom Backend ab; wir verarbeiten asynchron und benachrichtigen per Callback.' },
      { id: 'm15', role: 'user', text: 'Was ist die empfohlene Chunk-Größe?' },
      { id: 'm16', role: 'assistant', text: '500-2000 Reihen pro Chunk ist eine gute Orientierung.' },
      { id: 'm17', role: 'user', text: 'Gibt es eine Test-API, um den Import zu simulieren?' },
      { id: 'm18', role: 'assistant', text: 'Ja, in unserer Dev-Umgebung gibt es einen /simulate-import Endpunkt.' },
      { id: 'm19', role: 'user', text: 'Wie sehe ich die Import-Logs?' },
      { id: 'm20', role: 'assistant', text: 'Im Import-Dashboard unter /imports findest du Status und Logs.' },
      { id: 'm21', role: 'user', text: 'Was passiert bei doppelten SKUs?' },
      { id: 'm22', role: 'assistant', text: 'Standardmäßig wird das neueste Datum übernommen, du kannst das Verhalten konfigurieren.' },
      { id: 'm23', role: 'user', text: 'Kann ich Bilder beim Import referenzieren?' },
      { id: 'm24', role: 'assistant', text: 'Ja, per URL — der Server lädt die Bilder nach.' },
      { id: 'm25', role: 'user', text: 'Gibt es eine Sandbox mit Sample-Files?' },
      { id: 'm26', role: 'assistant', text: 'Ja, wir haben einige Beispiel-CSV-Dateien im Repo.' },
      { id: 'm27', role: 'user', text: 'Danke, das hilft.' },
      { id: 'm28', role: 'assistant', text: 'Gern geschehen — willst du, dass ich ein Beispielpaket erstelle?' },
      { id: 'm29', role: 'user', text: 'Ja, bitte.' },
      { id: 'm30', role: 'assistant', text: 'Ich erstelle ein Paket und poste den Download-Link.' },
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

type Props = {
  serviceId: string;
  conversationId: string;
  primaryColor?: string; // hex color, optional
}

const ConversationView: React.FC<Props> = ({ serviceId, conversationId, primaryColor }) => {
  const [conversations, setConversations] = useState(mockConversations);
  const [input, setInput] = useState('');
  // no CSS variable read here — prefer primaryColor prop

  const conversation = useMemo(() => conversations.find((c) => c.id === conversationId) ?? null, [conversations, conversationId]);

  // Keep the surrounding <main> scrolled to the bottom on mount and when messages change.
  const rootRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const mainEl = (rootEl && rootEl.closest && (rootEl.closest('main') as HTMLElement | null)) || document.querySelector('main');
    if (!mainEl) return;

    const scrollToBottom = () => {
      try {
        const max = (mainEl.scrollHeight - (mainEl.clientHeight || 0));
        // avoid negative values
        const top = Math.max(0, Math.floor(max));
        mainEl.scrollTo({ top, behavior: 'auto' });
      } catch (e) {
        try { mainEl.scrollTop = mainEl.scrollHeight; } catch {}
      }
    };

    // Use two RAFs to allow the browser to finish layout/paint tasks, then try a timeout fallback
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        scrollToBottom();
      });
      // also keep a reference to raf2 so we can cancel it on cleanup
      (scrollToBottom as any)._raf2 = raf2;
    });
    const timeout = window.setTimeout(scrollToBottom, 80);

    return () => {
      cancelAnimationFrame(raf1);
      const raf2 = (scrollToBottom as any)._raf2;
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  }, [conversation?.messages.length]);

  const sendMessage = () => {
    if (!conversation || !input.trim()) return;
    const message: ChatMessage = { id: `m-${Date.now()}`, role: 'user', text: input };
    const assistant: ChatMessage = { id: `m-${Date.now()}-a`, role: 'assistant', text: 'Antwort (Platzhalter) ...' };
    setConversations((prev) => prev.map((c) => c.id === conversationId ? { ...c, messages: [...c.messages, message, assistant] } : c));
    setInput('');
  };

  // If primaryColor prop is provided, convert to "r, g, b" and set as inline CSS var
  let rootStyle: React.CSSProperties | undefined;
  if (primaryColor) {
    try {
      const rgb = Color(primaryColor).rgb().array().join(', ');
      rootStyle = { ['--color-primary-rgb' as any]: rgb } as React.CSSProperties;
    } catch (e) {
      rootStyle = undefined;
    }
  } else {
    rootStyle = undefined;
  }

  if (!conversation) {
    return <div>Konversation nicht gefunden.</div>;
  }

  return (
    <div ref={rootRef} className={styles.root} data-service-id={serviceId} style={rootStyle}>
      <div className={styles.chatArea} style={{ width: '100%' }}>
        <h2>{conversation.title}</h2>
        <div className={styles.messages}>
          {conversation.messages.map((m) => {
            const roleIsUser = m.role === 'user';
            return (
              <div key={m.id} className={styles.message + ' ' + (roleIsUser ? styles.user : styles.assistant)}>
                <div className={styles.role}>{m.role}</div>
                <div className={styles.text}>{m.text}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.sendRow}>
          <input className={styles.sendInput} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nachricht eingeben..." />
          <Button type="button" onClick={sendMessage}>Senden</Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;

