'use client';

import React, { useCallback } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import JsonEditor from './JsonEditor.component';
import { createCollectionAction } from './CollectionCreateForm.server-action';

const DEFAULT_SCHEMA = JSON.stringify(
  {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
  },
  null,
  2,
);

type CollectionCreateFormValues = {
  name: string;
  schema: string;
};

type CollectionCreateFormProps = {
  serviceId: string;
};

const CollectionCreateForm: React.FunctionComponent<CollectionCreateFormProps> = ({
  serviceId,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleSubmit = useCallback(
    async (
      values: CollectionCreateFormValues,
      helpers: FormikHelpers<CollectionCreateFormValues>,
    ) => {
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
        const created = await createCollectionAction(serviceId, {
          name: values.name,
          schema,
        });
        router.push(`/dblight/${serviceId}/collection/${created.id}`);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Erstellen der Collection: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
        helpers.setSubmitting(false);
      }
    },
    [serviceId, router, openDialog],
  );

  return (
    <Formik<CollectionCreateFormValues>
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        schema: DEFAULT_SCHEMA,
      }}
    >
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Name
          <Input name="name" type="input" required />
        </label>
        <label>
          JSON Schema
          <JsonEditor name="schema" />
        </label>
        <div>
          <Button type="submit">
            Collection erstellen
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default CollectionCreateForm;
