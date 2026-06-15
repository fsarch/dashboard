'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { TEventTypeCreateDto } from '@/services/credence/credence.type';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import styles from './CreateEventTypeForm.module.scss';
import { createEventTypeAction } from './event-type.server-action';

type CreateEventTypeFormProps = {
  serviceId: string;
};

const CreateEventTypeForm: React.FunctionComponent<CreateEventTypeFormProps> = ({ serviceId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: TEventTypeCreateDto, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError(null);
    setSuccess(null);

    try {
      await createEventTypeAction(values, serviceId);
      setSuccess('Event Type erfolgreich erstellt!');
      window.location.reload();
    } catch (err) {
      setError('Fehler beim Erstellen des Event Types');
      console.error('Error creating event type:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        defaultScoreFactor: '',
        defaultTtlSeconds: 3600,
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.root}>
          <div className={styles.field}>
            <label htmlFor="name">Name *</label>
            <Input
              name="name"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. Login Event"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="defaultScoreFactor">Score Factor *</label>
            <Input
              name="defaultScoreFactor"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. 1.0"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="defaultTtlSeconds">TTL (Sekunden) *</label>
            <Input
              name="defaultTtlSeconds"
              type="number"
              disabled={isSubmitting}
              placeholder="z. B. 3600"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.actions}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert...' : 'Event Type erstellen'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateEventTypeForm;
