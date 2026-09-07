'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { createRecordAction, replaceRecordAction } from './RecordForm.server-action';

// `JsonEditor` pulls in `monaco-editor` (via `./monaco-setup`) at module
// scope, which references `window` during evaluation. Loaded statically,
// that blows up Next's server render, which then silently falls back to a
// full client-side re-render right as the user starts typing - remounting
// the editor and losing focus/cursor position mid-edit. `ssr: false` keeps
// the whole module out of the server render entirely.
const JsonEditor = dynamic(() => import('./JsonEditor.component'), {
  ssr: false,
});

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
        <div>
          {/*
            Deliberately a <div>, not a <label>: Monaco's actual input
            element is a focusable `div.native-edit-context` (the browser's
            EditContext API), but it sits next to a hidden, readOnly
            `textarea.ime-text-area` used only for IME composition. Because
            a <textarea> counts as "labelable", wrapping this in a <label>
            made the browser's automatic click-to-focus behavior steal focus
            from the real input onto that dead textarea on every click,
            silently swallowing all keyboard input.
          */}
          <div style={{ marginBottom: '0.5rem' }}>Daten (JSON)</div>
          <JsonEditor name="data" />
        </div>
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
