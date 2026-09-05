'use client';

import React, { useCallback } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import JsonEditor from './JsonEditor.component';
import { createRecordAction, replaceRecordAction } from './RecordForm.server-action';

type RecordFormValues = {
  data: string;
};

type RecordFormProps = {
  serviceId: string;
  collectionId: string;
  /** Present in edit mode: replaces this record instead of creating a new one. */
  recordId?: string;
  initialData?: Record<string, unknown>;
};

const RecordForm: React.FunctionComponent<RecordFormProps> = ({
  serviceId,
  collectionId,
  recordId,
  initialData,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();
  const isEdit = Boolean(recordId);

  const handleSubmit = useCallback(
    async (values: RecordFormValues, helpers: FormikHelpers<RecordFormValues>) => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(values.data);
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Die Eingabe ist kein gültiges JSON: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
        return;
      }

      try {
        if (recordId) {
          await replaceRecordAction(serviceId, collectionId, recordId, data);
          router.push(`/dblight/${serviceId}/collection/${collectionId}/record/${recordId}`);
        } else {
          const created = await createRecordAction(serviceId, collectionId, data);
          router.push(`/dblight/${serviceId}/collection/${collectionId}/record/${created.id}`);
        }
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Speichern: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
        helpers.setSubmitting(false);
      }
    },
    [serviceId, collectionId, recordId, router, openDialog],
  );

  return (
    <Formik<RecordFormValues>
      onSubmit={handleSubmit}
      initialValues={{
        data: JSON.stringify(initialData ?? {}, null, 2),
      }}
    >
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Daten (JSON)
          <JsonEditor name="data" />
        </label>
        <div>
          <Button type="submit">
            {isEdit ? 'Änderungen speichern' : 'Eintrag erstellen'}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default RecordForm;
