'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { createSchemaVersionAction } from './SchemaVersionForm.server-action';

// See RecordForm.component.tsx for why this must be `ssr: false`.
const JsonEditor = dynamic(() => import('./JsonEditor.component'), {
  ssr: false,
});

type SchemaVersionFormValues = {
  schema: string;
};

type SchemaVersionFormProps = {
  serviceId: string;
  collectionId: string;
  /** The currently active schema, used to pre-fill the editor as a starting point. */
  currentSchema: Record<string, unknown>;
};

/**
 * Publishes a new schema version. dblight-server itself is the sole judge of
 * whether the edited schema is backwards-compatible with existing records
 * (`SchemaCompatibilityService` validates every existing record against it) -
 * this form just submits the candidate and surfaces whatever error message
 * comes back (e.g. "one or more existing records would become invalid under
 * this schema") rather than trying to duplicate that check client-side.
 */
const SchemaVersionForm: React.FunctionComponent<SchemaVersionFormProps> = ({
  serviceId,
  collectionId,
  currentSchema,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleSubmit = useCallback(
    async (values: SchemaVersionFormValues, helpers: FormikHelpers<SchemaVersionFormValues>) => {
      let schema: Record<string, unknown>;
      try {
        schema = JSON.parse(values.schema);
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Das Schema ist kein gültiges JSON: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
        return;
      }

      try {
        await createSchemaVersionAction(serviceId, collectionId, schema);
        router.push(`/dblight/${serviceId}/collection/${collectionId}`);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Veröffentlichen der Schema-Version: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
        helpers.setSubmitting(false);
      }
    },
    [serviceId, collectionId, router, openDialog],
  );

  return (
    <Formik<SchemaVersionFormValues>
      onSubmit={handleSubmit}
      initialValues={{
        schema: JSON.stringify(currentSchema, null, 2),
      }}
    >
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p>
          Nur abwärtskompatible Änderungen werden akzeptiert (z. B. neue optionale Felder,
          neue Default-Werte, zusätzliche Enum-Werte). Der Server prüft das neue Schema gegen
          jeden bestehenden Eintrag der Collection und lehnt die Version ab, sobald auch nur
          ein Eintrag dadurch ungültig würde.
        </p>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>JSON Schema</div>
          <JsonEditor name="schema" />
        </div>
        <div>
          <Button type="submit">
            Neue Schema-Version veröffentlichen
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default SchemaVersionForm;
