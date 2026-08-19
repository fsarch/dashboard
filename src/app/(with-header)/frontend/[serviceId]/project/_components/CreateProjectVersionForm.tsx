'use client';

import React, { useCallback, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FileInput from '@/components/universals/forms/FileInput';
import Button from '@/components/universals/forms/Button';
import Section from '@/components/universals/section/Section';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import ProgressBar from '@/components/universals/progress/ProgressBar.component';
import { useRouter } from 'next/navigation';

type CreateProjectVersionFormProps = {
  serviceId: string;
  projectId: string;
};

type FormValues = {
  file: File | null;
};

/**
 * Lädt die Datei per XMLHttpRequest hoch (statt über eine Server Action), damit der
 * Fortschritt des Uploads über `upload.onprogress` verfolgt und angezeigt werden kann.
 */
const uploadFile = (
  url: string,
  file: File,
  onProgress: (percent: number) => void,
) => new Promise<void>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      onProgress((event.loaded / event.total) * 100);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      onProgress(100);
      resolve();
      return;
    }

    let message = `Fehler beim Hochladen (${xhr.status})`;
    try {
      const body = JSON.parse(xhr.responseText);
      message = body.error ?? message;
    } catch {
      // Antwort war kein JSON, Standardmeldung verwenden
    }
    reject(new Error(message));
  };

  xhr.onerror = () => reject(new Error('Netzwerkfehler beim Hochladen'));

  xhr.send(file);
});

const CreateProjectVersionForm: React.FunctionComponent<CreateProjectVersionFormProps> = ({
  serviceId,
  projectId,
}) => {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!values.file) {
        helpers.setFieldError('file', 'Bitte wählen Sie eine TAR-Datei aus');
        return;
      }

      setUploadProgress(0);

      try {
        await uploadFile(
          `/api/v1/frontend/${serviceId}/projects/${projectId}/versions`,
          values.file,
          setUploadProgress,
        );

        // Erfolg: Seite neu laden
        router.refresh();
        helpers.resetForm();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
        helpers.setStatus({ error: message });
      } finally {
        setUploadProgress(null);
      }
    },
    [serviceId, projectId, router]
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
                disabled={isSubmitting}
              />
            </FieldsetRow>

            {uploadProgress !== null && (
              <ProgressBar value={uploadProgress} />
            )}

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
