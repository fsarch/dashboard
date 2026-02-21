'use client'

import React, { useMemo, useState, useLayoutEffect, useRef } from 'react';
import Color from 'color';
import styles from './ChatPanel.module.scss';
import Button from '@/components/universals/forms/Button';
import { messagesService } from '@/services/ai/messages.service';
import { ConversationDto } from '@/services/ai/conversations.type';
import { MessageDto } from '@/services/ai/messages.type';
import { useRouter } from "next/navigation";
import { sendMessageToServer } from "@/components/apps/ai/ConversationView.server-action";

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

const mockConversations: Array<{ id: string; title: string; messages: ChatMessage[] }> = [
  {
    id: 'conv-1',
    title: 'Fragen zum Produkt-Import (Test-Long)',
    messages: [
      { id: 'm1', role: 'user', content: 'Wie importiere ich die CSV-Datei?' },
      { id: 'm2', role: 'assistant', content: 'Du kannst die Datei über das Import-Tool hochladen.' },
      { id: 'm3', role: 'user', content: 'Welche Spalten sind erforderlich?' },
      { id: 'm4', role: 'assistant', content: 'Mindestens SKU, Name und Preis.' },
      { id: 'm5', role: 'user', content: 'Gibt es ein Beispielformat?' },
      { id: 'm6', role: 'assistant', content: 'Ja, siehe unsere Dokumentation — wir unterstützen Semikolon- oder Komma-getrennte Dateien.' },
      { id: 'm7', role: 'user', content: 'Können Sonderzeichen wie ä/ö/ü auftauchen?' },
      { id: 'm8', role: 'assistant', content: 'Ja, UTF-8 wird empfohlen.' },
      { id: 'm9', role: 'user', content: 'Wie behandelt das System fehlende Preise?' },
      { id: 'm10', role: 'assistant', content: 'Fehlende Preise werden als Fehler markiert und nicht importiert.' },
      { id: 'm11', role: 'user', content: 'Kann ich Bulk-Updates durchführen?' },
      { id: 'm12', role: 'assistant', content: 'Ja, über denselben Importmechanismus mit Update-Flag.' },
      { id: 'm13', role: 'user', content: 'Wie lange dauert ein großer Import (100k Zeilen)?' },
      { id: 'm14', role: 'assistant', content: 'Das hängt vom Backend ab; wir verarbeiten asynchron und benachrichtigen per Callback.' },
      { id: 'm15', role: 'user', content: 'Was ist die empfohlene Chunk-Größe?' },
      { id: 'm16', role: 'assistant', content: '500-2000 Reihen pro Chunk ist eine gute Orientierung.' },
      { id: 'm17', role: 'user', content: 'Gibt es eine Test-API, um den Import zu simulieren?' },
      { id: 'm18', role: 'assistant', content: 'Ja, in unserer Dev-Umgebung gibt es einen /simulate-import Endpunkt.' },
      { id: 'm19', role: 'user', content: 'Wie sehe ich die Import-Logs?' },
      { id: 'm20', role: 'assistant', content: 'Im Import-Dashboard unter /imports findest du Status und Logs.' },
      { id: 'm21', role: 'user', content: 'Was passiert bei doppelten SKUs?' },
      { id: 'm22', role: 'assistant', content: 'Standardmäßig wird das neueste Datum übernommen, du kannst das Verhalten konfigurieren.' },
      { id: 'm23', role: 'user', content: 'Kann ich Bilder beim Import referenzieren?' },
      { id: 'm24', role: 'assistant', content: 'Ja, per URL — der Server lädt die Bilder nach.' },
      { id: 'm25', role: 'user', content: 'Gibt es eine Sandbox mit Sample-Files?' },
      { id: 'm26', role: 'assistant', content: 'Ja, wir haben einige Beispiel-CSV-Dateien im Repo.' },
      { id: 'm27', role: 'user', content: 'Danke, das hilft.' },
      { id: 'm28', role: 'assistant', content: 'Gern geschehen — willst du, dass ich ein Beispielpaket erstelle?' },
      { id: 'm29', role: 'user', content: 'Ja, bitte.' },
      { id: 'm30', role: 'assistant', content: 'Ich erstelle ein Paket und poste den Download-Link.' },
    ],
  },
  {
    id: 'conv-2',
    title: 'Preisberechnung',
    messages: [
      { id: 'm1', role: 'user', content: 'Wie berechne ich den Endpreis?' },
      { id: 'm2', role: 'assistant', content: 'Berücksichtige Margen, Steuern und Versandkosten.' },
    ],
  },
];

type Props = {
  serviceId: string;
  conversationId: string;
  primaryColor?: string; // hex color, optional
  conversation?: ConversationDto | null;
  messages?: MessageDto[] | null;
}

const ConversationView: React.FC<Props> = ({ serviceId, conversationId, primaryColor, conversation: conversationProp = null, messages: messagesProp = null }) => {
  const [input, setInput] = useState('');
  // no CSS variable read here — prefer primaryColor prop

  const [conversation, setConversation] = useState<ConversationDto | null>(() => conversationProp ?? (mockConversations.find((c) => c.id === conversationId) as any ?? null));
  const [messages, setMessages] = useState<MessageDto[]>(() => messagesProp ?? (conversation ? (mockConversations.find(c => c.id === conversation.id)?.messages as any as MessageDto[]) ?? [] : []));

  // Keep the surrounding <main> scrolled to the bottom on mount and when messages change.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const scrollToLast = () => {
      const last = messagesRef.current?.lastElementChild as HTMLElement | null;
      if (last) {
        try {
          last.scrollIntoView({ block: 'end', behavior: 'auto' });
          return true;
        } catch (e) {
          // ignore and fall back
        }
      }
      return false;
    };

    // Try twice with RAFs, then fallback to timeout and finally fallbackScroll
    const raf1 = requestAnimationFrame(() => {
      // assign raf2 directly to the function property to avoid an unused local var
      (scrollToLast as any)._raf2 = requestAnimationFrame(() => {
        const ok = scrollToLast();
      });
    });
    const timeout = window.setTimeout(() => {
      const ok = scrollToLast();
    }, 120);

    return () => {
      cancelAnimationFrame(raf1);
      const raf2 = (scrollToLast as any)._raf2;
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  }, [messages.length]);

  const router = useRouter();
  const sendMessage = async () => {
    if (!conversation || !input.trim()) return;
    try {
      // create message via service
      const created = await sendMessageToServer({
        conversationId: conversation.id!,
        content: input.trim(),
      })
      // optionally the assistant response might be created server-side; for now append created
      setMessages((prev) => [...prev, created]);
      setInput('');
    } catch (e) {
      console.error('failed to send message', e);
    }
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

  console.log('messages', messages);

  return (
    <div ref={rootRef} className={styles.root} data-service-id={serviceId} style={rootStyle}>
      <div className={styles.chatArea} style={{ width: '100%' }}>
        <h2>{conversation.name || conversation.id}</h2>
        <div className={styles.messages} ref={messagesRef}>
          {messages.map((m) => {
            const roleIsUser = m.role === 'user';
            return (
              <div key={m.id} className={styles.message + ' ' + (roleIsUser ? styles.user : styles.assistant)}>
                <div className={styles.role}>{m.role}</div>
                <div className={styles.text}>{m.content}</div>
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

