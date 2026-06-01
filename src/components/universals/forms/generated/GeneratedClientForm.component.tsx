'use client';

import React, { useCallback } from 'react';
import {
  TGeneratedFormInitialValues,
  TGeneratedFormInput, TGeneratedFormSubmitResponse, TSubmitButtonsFormDefinition
} from "@/components/universals/forms/generated/GeneratedForm.type";
import { Form, Formik, FormikHelpers } from "formik";
import Button from "@/components/universals/forms/Button";
import { useRouter } from "next/navigation";
import GeneratedFormTextInput from "@/components/universals/forms/generated/inputs/GeneratedFormTextInput.component";
import GeneratedFormSelectInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormSelectInput.component";
import GeneratedFormImageServerUploadInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormImageServerUploadInput.component";
import { useWithLoading } from "@/components/universals/loader/LoadingProvider.context";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import GeneratedNestedForm from "@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedForm.component";
import { renderGeneratedFormInputs } from "@/components/universals/forms/generated/renderGeneratedFormInputs";

type GeneratedClientFormProps = {
  definition: Array<TGeneratedFormInput>;
  initialValues: TGeneratedFormInitialValues;
  onSubmit: (data: TGeneratedFormInitialValues) => Promise<TGeneratedFormSubmitResponse>;
  buttons?: TSubmitButtonsFormDefinition;
};

const GeneratedClientForm: React.FunctionComponent<GeneratedClientFormProps> = ({
  definition,
  initialValues,
  onSubmit,
  buttons,
}) => {
  const router = useRouter();

  const withLoader = useWithLoading();

  const handleSubmit = useCallback(async (data: TGeneratedFormInitialValues, helper: FormikHelpers<TGeneratedFormInitialValues>) => {
    const response = await withLoader(() => onSubmit(data));

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
  }, [onSubmit, router, withLoader]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <Fieldset>
          {renderGeneratedFormInputs(definition)}
        </Fieldset>
        <Button type="submit">
          {buttons?.submitButtonText ?? 'Erstellen'}
        </Button>
      </Form>
    </Formik>
  );
};

export default GeneratedClientForm;
