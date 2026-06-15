'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { TIpAsnDataCreateBodyDto } from '@/services/credence/credence.type';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import styles from './CreateIpAsnDataForm.module.scss';
import { createIpAsnDataAction } from './ip-asn-data.server-action';

type CreateIpAsnDataFormProps = {
  datasourceId: string;
  serviceId: string;
};

const CreateIpAsnDataForm: React.FunctionComponent<CreateIpAsnDataFormProps> = ({ datasourceId, serviceId }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: TIpAsnDataCreateBodyDto, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError(null);
    setSuccess(null);

    try {
      await createIpAsnDataAction(datasourceId, values, serviceId);
      setSuccess('IP-ASN Daten erfolgreich erstellt!');
      window.location.reload();
    } catch (err) {
      setError('Fehler beim Erstellen der IP-ASN Daten');
      console.error('Error creating IP-ASN data:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        prefix: '',
        asn: 0,
        asnOrganization: '',
        externalId: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.root}>
          <div className={styles.field}>
            <label htmlFor="prefix">Prefix *</label>
            <Input
              name="prefix"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. 192.168.1.0/24"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="asn">ASN *</label>
            <Input
              name="asn"
              type="number"
              disabled={isSubmitting}
              placeholder="z. B. 12345"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="asnOrganization">ASN Organisation *</label>
            <Input
              name="asnOrganization"
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
              placeholder="z. B. ripe-12345"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.actions}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert...' : 'IP-ASN Daten erstellen'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateIpAsnDataForm;
