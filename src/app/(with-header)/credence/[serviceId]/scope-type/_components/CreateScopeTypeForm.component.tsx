'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { TScopeTypeCreateDto, TScopeDataTypeDto, TPaginationParams, TPaginationResultDto } from '@/services/credence/credence.type';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import Select from '@/components/universals/forms/Select';
import styles from './CreateScopeTypeForm.module.scss';
import { loadScopeDataTypesAction, createScopeTypeAction } from './scope-type.server-action';

type CreateScopeTypeFormProps = {
  serviceId: string;
};

const CreateScopeTypeForm: React.FunctionComponent<CreateScopeTypeFormProps> = ({ serviceId }) => {
  const [scopeDataTypes, setScopeDataTypes] = useState<TScopeDataTypeDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchScopeDataTypes = async () => {
      try {
        const params: TPaginationParams = { page: 1, pageSize: 100 };
        const result: TPaginationResultDto<TScopeDataTypeDto> = await loadScopeDataTypesAction(params, serviceId);
        setScopeDataTypes(result.data);
      } catch (err) {
        setError('Fehler beim Laden der Scope Data Types');
      } finally {
        setIsLoading(false);
      }
    };
    fetchScopeDataTypes();
  }, [serviceId]);

  const handleSubmit = async (values: TScopeTypeCreateDto, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError(null);
    setSuccess(null);

    try {
      await createScopeTypeAction(values, serviceId);
      setSuccess('Scope Type erfolgreich erstellt!');
      window.location.reload();
    } catch (err) {
      setError('Fehler beim Erstellen des Scope Types');
      console.error('Error creating scope type:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const scopeDataTypeOptions = scopeDataTypes.map((sd) => ({
    value: sd.id.toString(),
    label: sd.name,
  }));

  if (isLoading) {
    return <p>Lade Scope Data Types...</p>;
  }

  return (
    <Formik
      initialValues={{
        scopeDataTypeId: scopeDataTypes[0]?.id || '',
        name: '',
        key: '',
        scoreFactor: '',
        externalId: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.root}>
          <div className={styles.field}>
            <label htmlFor="scopeDataTypeId">Scope Data Type *</label>
            <Select
              name="scopeDataTypeId"
              values={scopeDataTypeOptions}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="name">Name *</label>
            <Input
              name="name"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. IP Adresse"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="key">Key *</label>
            <Input
              name="key"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. ip"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="scoreFactor">Score Factor *</label>
            <Input
              name="scoreFactor"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. 1.0"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="externalId">Externe ID (optional)</label>
            <Input
              name="externalId"
              type="text"
              disabled={isSubmitting}
              placeholder="z. B. ip-scope-type"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.actions}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wird gespeichert...' : 'Scope Type erstellen'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateScopeTypeForm;
