'use client';

import { Form, Formik } from 'formik';
import type React from 'react';
import { useCallback } from 'react';
import AiIcon from '@/components/apps/ai/icons/AiIcon';
import FormikSubmitButton from '@/components/universals/forms/FormikSubmitButton.component';
import Input from '@/components/universals/forms/Input';
import Select from '@/components/universals/forms/Select';
import type { AgentDto } from '@/services/ai/agents.type';
import styles from './ConversationStarter.module.scss';

type Props = {
  serviceId?: string;
  agents?: Array<AgentDto>;
  // server action expects FormData when used as a form action
  onStart: (formData: {
    initialMessage: string;
    agentId?: string;
  }) => Promise<any> | any;
};

const ConversationStarter: React.FC<Props> = ({
  serviceId,
  agents,
  onStart,
}) => {
  const handleSubmit = useCallback(
    (values: { initialMessage: string; agentId: string }) => {
      onStart(values);
    },
    [onStart],
  );

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <div className={styles.titleWrapper}>
          <AiIcon className={styles.aiIcon} enableAnimation />
          <h3 className={styles.title}>Starte eine neue Konversation</h3>
        </div>
        <Formik
          initialValues={{
            initialMessage: '',
            agentId: '',
          }}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <div className={styles.inputRow}>
              <Input
                type="text"
                name="initialMessage"
                className={styles.input}
                placeholder="Stelle eine Frage oder gib ein Prompt ein..."
              />
              <FormikSubmitButton buttonClassName={styles.submitButton}>
                <AiIcon enableAnimation={false} />
                Start
              </FormikSubmitButton>
            </div>
            {agents && agents.length > 0 && (
              <details className={styles.advancedSettings}>
                <summary>Erweiterte Einstellungen</summary>
                <Select
                  id="agentId"
                  name="agentId"
                  values={[
                    { value: '', label: 'Agent: Standard (kein Agent)' },
                    ...agents.map((a) => ({
                      id: a.id,
                      value: a.id,
                      label: `Agent: ${a.name}`,
                    })),
                  ]}
                />
              </details>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ConversationStarter;
