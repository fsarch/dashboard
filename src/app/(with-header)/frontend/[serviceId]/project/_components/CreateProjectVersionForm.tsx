'use client';

import React, { useCallback } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FileInput from '@/components/universals/forms/FileInput';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { createProjectVersion } from './CreateProjectVersionForm.server-action';
import { useRouter } from 'next/navigation';

type CreateProjectVersionFormProps = {
  projectId: string;
};

type FormValues = {
  file: File | null;
};

const CreateProjectVersionForm: React.FunctionComponent<CreateProjectVersionFormProps> = ({
  projectId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!values.file) {
        helpers.setFieldError('file', 'Bitte wählen Sie eine TAR-Datei aus');
        return;
      }

      try {
        // FormData für die Server Action vorbereiten
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('file', values.file);

        // Server Action aufrufen
        await createProjectVersion(formData);

        // Erfolg: Seite neu laden
        router.refresh();
        helpers.resetForm();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
        helpers.setStatus({ error: message });
      }
    },
    [projectId, router]
  );

  return (
    <Section name="Neue Version erstellen">
      <Formik
        initialValues={{
          file: null as File | null,
        }}
        onSubmit={handleSubmit}
      >
        {({ status, isSubmitting }) => (
          <Form>
            {status?.error && (
              <div style={{ color: 'red', marginBottom: '1rem' }}>
                {status.error}
              </div>
            )}

            <FieldsetRow label="Archiv-Datei (TAR oder ZIP)">
              <FileInput
                name="file"
                accept=".tar,.zip,application/x-tar,application/x-gtar,application/zip,application/x-zip-compressed"
                required
              />
            </FieldsetRow>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Hochladen...' : 'Version erstellen'}
            </Button>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

export default CreateProjectVersionForm;
