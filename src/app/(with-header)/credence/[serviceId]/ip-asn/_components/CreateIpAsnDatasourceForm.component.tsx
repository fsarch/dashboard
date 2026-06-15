'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { TIpAsnDatasourceCreateDto } from '@/services/credence/credence.type';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import styles from './CreateIpAsnDatasourceForm.module.scss';
import { createIpAsnDatasourceAction } from './ip-asn-datasource.server-action';

type CreateIpAsnDatasourceFormProps = {
  serviceId: string;
};

const CreateIpAsnDatasourceForm: React.FunctionComponent<CreateIpAsnDatasourceFormProps> = ({ serviceId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: TIpAsnDatasourceCreateDto, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError(null);
    setSuccess(null);

    try {
      await createIpAsnDatasourceAction(values, serviceId);
      setSuccess('IP-ASN Datenquelle erfolgreich erstellt!');
      window.location.reload();
    } catch (err) {
      setError('Fehler beim Erstellen der IP-ASN Datenquelle');
      console.error('Error creating IP-ASN datasource:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        externalId: '',
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
              placeholder="z. B. RIPE NCC"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="externalId">Externe ID (optional)</label>
            <Input
              name="externalId"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. ripe-ncc-2024"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.actions}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert...' : 'IP-ASN Datenquelle erstellen'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateIpAsnDatasourceForm;
