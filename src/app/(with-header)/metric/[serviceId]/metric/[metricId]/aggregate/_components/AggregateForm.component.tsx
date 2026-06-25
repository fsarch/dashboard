'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { aggregateMeasurementsAction, TAggregateFormState } from './AggregateForm.server-action';
import Button from '@/components/universals/forms/Button';
import styles from './AggregateForm.module.scss';
import AggregateResultChart from './AggregateResultChart.component';

type AggregateFormProps = {
  serviceId: string;
  metricId: string;
  metricName: string;
};

const SubmitButton: React.FunctionComponent = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Aggregating...' : 'Aggregate'}
    </Button>
  );
};

const AggregateForm: React.FunctionComponent<AggregateFormProps> = ({
  serviceId,
  metricId,
  metricName,
}) => {
  const [state, formAction] = useFormState<TAggregateFormState, FormData>(
    (prevState, formData) => aggregateMeasurementsAction(serviceId, metricId, prevState, formData),
    {}
  );

  const now = new Date();
  const defaultStartTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultEndTime = now.toISOString().slice(0, 16);

  return (
    <div className={styles.root}>
      <h3>Aggregate Measurements for: {metricName || metricId}</h3>

      <form action={formAction} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="startTime">Start Time *</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            defaultValue={defaultStartTime}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="endTime">End Time *</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            defaultValue={defaultEndTime}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="interval">Interval *</label>
          <select id="interval" name="interval" defaultValue="hour" required>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="aggregation">Aggregation *</label>
          <select id="aggregation" name="aggregation" defaultValue="avg" required>
            <option value="avg">Average (avg)</option>
            <option value="sum">Sum</option>
            <option value="min">Minimum</option>
            <option value="max">Maximum</option>
            <option value="count">Count</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>
            <input
              type="checkbox"
              id="warmTierOnly"
              name="warmTierOnly"
              defaultChecked={false}
            />
            Warm Tier Only
          </label>
        </div>

        <div className={styles.actions}>
          <SubmitButton />
        </div>
      </form>

      {state.success && state.result && (
        <>
          <AggregateResultChart
            result={state.result}
            aggregationType={state.aggregation || 'avg'}
            interval={state.interval || 'hour'}
          />
          <div className={styles.result}>
            <h4>Aggregation Result (JSON):</h4>
            <pre>{JSON.stringify(state.result, null, 2)}</pre>
          </div>
        </>
      )}

      {state.error && (
        <div className={styles.error}>
          <strong>Error:</strong> {state.error}
        </div>
      )}
    </div>
  );
};

export default AggregateForm;
