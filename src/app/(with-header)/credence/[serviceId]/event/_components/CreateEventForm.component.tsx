'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { TEventCreateDto, TScopeValueDto, TEventTypeDto, TPaginationResultDto, TPaginationParams } from '@/services/credence/credence.type';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import Select from '@/components/universals/forms/Select';
import styles from './CreateEventForm.module.scss';
import { loadEventTypesAction, createEventAction } from './event.server-action';

type CreateEventFormProps = {
  serviceId: string;
};

const scopeTypeOptions = [
  { value: 'ip', label: 'IP' },
  { value: 'asn', label: 'ASN' },
  { value: 'subnet', label: 'Subnet' },
  { value: 'browserFingerprint', label: 'Browser Fingerprint' },
  { value: 'customFingerprint', label: 'Custom Fingerprint' },
];

const CreateEventForm: React.FunctionComponent<CreateEventFormProps> = ({ serviceId }) => {
  const [eventTypes, setEventTypes] = useState<TEventTypeDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const params: TPaginationParams = { page: 1, pageSize: 100 };
        const result: TPaginationResultDto<TEventTypeDto> = await loadEventTypesAction(params, serviceId);
        setEventTypes(result.data);
      } catch (err) {
        setError('Fehler beim Laden der Event Types');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventTypes();
  }, [serviceId]);

  const handleSubmit = async (values: { eventTypeId: string; externalId: string; scopes: TScopeValueDto[] }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError(null);
    setSuccess(null);

    try {
      const validScopes = values.scopes.filter(s => s.value.trim() !== '');
      if (validScopes.length === 0) {
        setError('Mindestens ein Scope muss ausgefüllt sein');
        setSubmitting(false);
        return;
      }

      const eventDto: TEventCreateDto = {
        eventTypeId: values.eventTypeId,
        scopes: validScopes,
        externalId: values.externalId || undefined,
      };

      await createEventAction(eventDto, serviceId);
      setSuccess('Event erfolgreich erstellt!');
    } catch (err) {
      setError('Fehler beim Erstellen des Events');
      console.error('Error creating event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const eventTypeOptions = eventTypes.map((eventType) => ({
    value: eventType.id,
    label: `${eventType.name} (Score: ${eventType.defaultScoreFactor}, TTL: ${eventType.defaultTtlSeconds}s)`,
  }));

  if (isLoading) {
    return <p>Lade Event Types...</p>;
  }

  return (
    <Formik
      initialValues={{
        eventTypeId: eventTypes[0]?.id || '',
        externalId: '',
        scopes: [{ type: 'ip', value: '' }],
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form className={styles.root}>
          <div className={styles.field}>
            <label htmlFor="eventTypeId">Event Type *</label>
            <Select
              name="eventTypeId"
              values={eventTypeOptions}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label>Scopes *</label>
            <FieldArray name="scopes">
              {({ push, remove }) => (
                <>
                  {values.scopes.map((scope, index) => (
                    <div key={index} className={styles.scopeRow}>
                      <Select
                        name={`scopes.${index}.type`}
                        values={scopeTypeOptions}
                        disabled={isSubmitting}
                        className={styles.scopeType}
                      />
                      <Input
                        name={`scopes.${index}.value`}
                        type="text"
                        placeholder="Wert"
                        disabled={isSubmitting}
                        className={styles.scopeValue}
                      />
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={values.scopes.length <= 1 || isSubmitting}
                        variant="danger"
                        size="small"
                      >
                        Entfernen
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => push({ type: 'ip', value: '' })}
                    disabled={isSubmitting}
                  >
                    Scope hinzufügen
                  </Button>
                </>
              )}
            </FieldArray>
          </div>

          <div className={styles.field}>
            <label htmlFor="externalId">Externe ID (optional)</label>
            <Input
              name="externalId"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. request-12345"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.actions}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert...' : 'Event erstellen'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateEventForm;
