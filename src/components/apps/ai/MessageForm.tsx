'use client'

import React from 'react';
import { Formik, Form, Field } from 'formik';
import AiIcon from '@/components/apps/ai/icons/AiIcon';
import { sendMessageToServer } from '@/components/apps/ai/ConversationView.server-action';
import type { MessageWithAuthor } from '@/services/ai/messages.type';
import styles from './ConversationView.module.scss';
import FormikSubmitButton from "@/components/universals/forms/FormikSubmitButton.component";

type Props = {
  conversationId: string;
  onMessagesCreatedAction: (messages: MessageWithAuthor[]) => void;
};

export default function MessageForm({ conversationId, onMessagesCreatedAction }: Props) {
  return (
    <Formik
      initialValues={{ content: '' }}
      validate={(values) => {
        const errors: { content?: string } = {};
        if (!values.content || !values.content.trim()) errors.content = 'Bitte Nachricht eingeben';
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
        try {
          setSubmitting(true);
          // Call server action — always returns array of created messages
          const res = await sendMessageToServer({ conversationId, content: values.content.trim() });
          onMessagesCreatedAction(res);
          resetForm();
        } catch (e: any) {
          setErrors({ content: e?.message ?? 'Fehler beim Senden' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form className={styles.sendRow}>
        <Field name="content">
          {({ field }: any) => (
            <input {...field} className={styles.sendInput} placeholder="Nachricht eingeben..." />
          )}
        </Field>
        <FormikSubmitButton buttonClassName={styles.sendButton}>
          <AiIcon />Senden
        </FormikSubmitButton>
      </Form>
    </Formik>
  );
}
