'use client'

import React, { useCallback, useState } from 'react';
import styles from './ConversationStarter.module.scss';
import AiIcon from "@/components/apps/ai/icons/AiIcon";
import { Field, Form, Formik } from "formik";
import FormikSubmitButton from "@/components/universals/forms/FormikSubmitButton.component";
import Input from "@/components/universals/forms/Input";

type Props = {
  serviceId?: string;
  // server action expects FormData when used as a form action
  onStart: (formData: { initialMessage: string }) => Promise<any> | any;
}

const ConversationStarter: React.FC<Props> = ({ serviceId, onStart }) => {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback((values: { initialMessage: string }) => {
    onStart(values);
  }, [onStart]);

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <div className={styles.titleWrapper}>
          <AiIcon className={styles.aiIcon} enableAnimation/>
          <h3 className={styles.title}>Starte eine neue Konversation</h3>
        </div>
        <Formik
          initialValues={{
            initialMessage: '',
          }}
          onSubmit={handleSubmit}
        >
          <Form className={styles.inputRow}>
            <Input name="initialMessage" className={styles.input} defaultValue={value} placeholder="Stelle eine Frage oder gib ein Prompt ein..." />
            <FormikSubmitButton buttonClassName={styles.submitButton}><AiIcon enableAnimation={false} />Start</FormikSubmitButton>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ConversationStarter;
