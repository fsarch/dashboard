'use client';

import React, { useState } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import Input from '@/components/universals/forms/Input';
import Button from '@/components/universals/forms/Button';
import RRuleBuilder from '@/components/apps/calendar/RRuleBuilder.component';
import { TEventSeriesDto } from '@/services/calendar/calendar.type';

export type TSeriesFormValues = {
  externalId: string;
  timezone: string;
  rrule: string;
  validFrom: string;
  validTo: string;
};

// Bridges the RRuleBuilder (plain value/onChange) to the surrounding Formik form.
const RRuleField: React.FunctionComponent = () => {
  const { values, setFieldValue } = useFormikContext<TSeriesFormValues>();

  return (
    <RRuleBuilder
      value={values.rrule}
      onChange={(rrule) => setFieldValue('rrule', rrule)}
    />
  );
};

type SeriesFormProps = {
  initialValues: TSeriesFormValues;
  onSubmit: (values: TSeriesFormValues) => Promise<TEventSeriesDto>;
  submitLabel: string;
  // Base path the created series' id gets appended to (e.g. ".../event/x/series"). Only plain,
  // serializable data can cross the server -> client boundary, so this must be a string, not a
  // callback.
  redirectToBasePath?: string;
};

const SeriesForm: React.FunctionComponent<SeriesFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel,
  redirectToBasePath,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: TSeriesFormValues) => {
    setError(null);
    try {
      const series = await onSubmit(values);
      if (redirectToBasePath) {
        router.push(`${redirectToBasePath}/${series.id}`);
      } else {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '640px' }}>
        <div>
          <label htmlFor="series-externalId">Externe ID</label>
          <Input id="series-externalId" name="externalId" type="text" />
        </div>
        <div>
          <label htmlFor="series-timezone">Zeitzone *</label>
          <Input id="series-timezone" name="timezone" type="text" placeholder="Europe/Berlin" required />
        </div>
        <div>
          <label htmlFor="series-rrule">RRULE *</label>
          <Input id="series-rrule" name="rrule" type="text" placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR" required />
        </div>
        <RRuleField />
        <div>
          <label htmlFor="series-validFrom">Gültig ab *</label>
          <Input id="series-validFrom" name="validFrom" type="datetime-local" required />
        </div>
        <div>
          <label htmlFor="series-validTo">Gültig bis</label>
          <Input id="series-validTo" name="validTo" type="datetime-local" />
        </div>
        {error ? <div style={{ color: '#BB0000' }}>{error}</div> : null}
        <div>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </Form>
    </Formik>
  );
};

export default SeriesForm;
