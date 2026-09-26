'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import Button from '@/components/universals/forms/Button';
import Fieldset from '@/components/universals/forms/Fieldset.component';
import DevDataSourcesSection from '@/components/universals/forms/generated/DevDataSourcesSection.component';
import {
  type TEvaluationDebugInfo,
  TGeneratedFormDataSource,
  type TGeneratedFormInitialValues,
  type TGeneratedFormInput,
  type TGeneratedFormSubmitResponse,
  type TSubmitButtonsFormDefinition,
} from '@/components/universals/forms/generated/GeneratedForm.type';
import GeneratedFormImageServerUploadInput from '@/components/universals/forms/generated/inputs/GeneratedFormImageServerUploadInput.component';
import GeneratedFormSelectInput from '@/components/universals/forms/generated/inputs/GeneratedFormSelectInput.component';
import GeneratedFormTextInput from '@/components/universals/forms/generated/inputs/GeneratedFormTextInput.component';
import GeneratedNestedForm from '@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedForm.component';
import { renderGeneratedFormInputs } from '@/components/universals/forms/generated/renderGeneratedFormInputs';
import { useWithLoading } from '@/components/universals/loader/LoadingProvider.context';

const getErrorMessage = (
  body: Record<string, unknown> | null | undefined,
): string => {
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return 'Die Anfrage ist fehlgeschlagen.';
};

type GeneratedClientFormProps = {
  definition: Array<TGeneratedFormInput>;
  initialValues: TGeneratedFormInitialValues;
  onSubmit: (
    data: TGeneratedFormInitialValues,
  ) => Promise<TGeneratedFormSubmitResponse>;
  buttons?: TSubmitButtonsFormDefinition;
  isDev?: boolean;
  debugInfo?: TEvaluationDebugInfo;
};

const GeneratedClientForm: React.FunctionComponent<
  GeneratedClientFormProps
> = ({ definition, initialValues, onSubmit, buttons, isDev, debugInfo }) => {
  const router = useRouter();

  const withLoader = useWithLoading();
  const openDialog = useOpenDialog();

  const handleSubmit = useCallback(
    async (
      data: TGeneratedFormInitialValues,
      helper: FormikHelpers<TGeneratedFormInitialValues>,
    ) => {
      let response: TGeneratedFormSubmitResponse;

      try {
        response = await withLoader(() => onSubmit(data));
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Speichern: ${error instanceof Error ? error.message : String(error)}`,
        });
        return;
      }

      if (!response.response.ok) {
        await openDialog(AlertDialog, {
          text: getErrorMessage(response.response.body),
        });
        return;
      }

      router.refresh();

      if (response.actions) {
        response.actions.forEach((action) => {
          if (action.$type === 'redirect') {
            if (action.url.$type !== 'constant') {
              return;
            }

            router.push(action.url.value);
          }
        });
      }
    },
    [onSubmit, router, withLoader, openDialog],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        {isDev && debugInfo && (
          <DevDataSourcesSection
            definition={definition}
            debugInfo={debugInfo}
            initialValues={initialValues}
          />
        )}
        <Fieldset>{renderGeneratedFormInputs(definition)}</Fieldset>
        <Button type="submit">
          {buttons?.submitButtonText ?? 'Erstellen'}
        </Button>
      </Form>
    </Formik>
  );
};

export default GeneratedClientForm;
