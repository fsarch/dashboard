'use client';

import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import Input from '@/components/universals/forms/Input';
import TextArea from '@/components/universals/forms/TextArea';
import Button from '@/components/universals/forms/Button';
import { TEventDto } from '@/services/calendar/calendar.type';

export type TEventFormValues = {
  title: string;
  description: string;
  externalId: string;
  timezone: string;
  startAt: string;
  endAt: string;
  // Raw JSON text as typed/displayed in the metadata textarea - see
  // calendar.utils.ts#parseMetadataJson/toMetadataJsonValue for the (de)serialization.
  metadata: string;
};

type EventFormProps = {
  initialValues: TEventFormValues;
  onSubmit: (values: TEventFormValues) => Promise<TEventDto>;
  submitLabel: string;
  // Base path the created event's id gets appended to (e.g. "/calendar/x/calendar/y/event").
  // Only plain, serializable data can cross the server -> client boundary, so this must be a
  // string, not a callback.
  redirectToBasePath?: string;
};

const EventForm: React.FunctionComponent<EventFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel,
  redirectToBasePath,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: TEventFormValues) => {
    setError(null);
    try {
      const event = await onSubmit(values);
      if (redirectToBasePath) {
        router.push(`${redirectToBasePath}/${event.id}`);
      } else {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '480px' }}>
        <div>
          <label htmlFor="event-title">Titel</label>
          <Input id="event-title" name="title" type="text" />
        </div>
        <div>
          <label htmlFor="event-description">Beschreibung</label>
          <TextArea name="description" />
        </div>
        <div>
          <label htmlFor="event-externalId">Externe ID</label>
          <Input id="event-externalId" name="externalId" type="text" />
        </div>
        <div>
          <label htmlFor="event-timezone">Zeitzone</label>
          <Input id="event-timezone" name="timezone" type="text" placeholder="Europe/Berlin" />
        </div>
        <div>
          <label htmlFor="event-startAt">Start *</label>
          <Input id="event-startAt" name="startAt" type="datetime-local" required />
        </div>
        <div>
          <label htmlFor="event-endAt">Ende</label>
          <Input id="event-endAt" name="endAt" type="datetime-local" />
        </div>
        <div>
          <label htmlFor="event-metadata">Metadaten (JSON)</label>
          <TextArea name="metadata" />
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Optional, z.B. {'{ "source": "import" }'}
          </div>
        </div>
        {error ? <div style={{ color: '#BB0000' }}>{error}</div> : null}
        <div>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </Form>
    </Formik>
  );
};

export default EventForm;
