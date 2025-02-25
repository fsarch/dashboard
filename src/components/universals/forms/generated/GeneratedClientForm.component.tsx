'use client';

import React, { useCallback } from 'react';
import {
  TGeneratedFormInitialValues,
  TGeneratedFormInput
} from "@/components/universals/forms/generated/GeneratedForm.type";
import { Form, Formik, FormikHelpers } from "formik";
import Button from "@/components/universals/forms/Button";
import Input from "@/components/universals/forms/Input";
import { useRouter } from "next/navigation";
import GeneratedFormTextInput from "@/components/universals/forms/generated/inputs/GeneratedFormTextInput.component";
import GeneratedFormSelectInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormSelectInput.component";
import GeneratedFormImageServerUploadInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormImageServerUploadInput.component";

type GeneratedClientFormProps = {
  definition: Array<TGeneratedFormInput>;
  initialValues: TGeneratedFormInitialValues;
  onSubmit: (data: TGeneratedFormInitialValues) => Promise<void>;
};

const GeneratedClientForm: React.FunctionComponent<GeneratedClientFormProps> = ({
  definition,
  initialValues,
  onSubmit,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (data: TGeneratedFormInitialValues, helper: FormikHelpers<TGeneratedFormInitialValues>) => {
    await onSubmit(data);

    router.refresh();
    helper.resetForm();
  }, [onSubmit, router]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        {definition.map((input) => {
          if (input.type === 'text') {
            return (
              <GeneratedFormTextInput
                key={input.id}
                input={input}
              />
            );
          }

          if (input.type === 'select') {
            return (
              <GeneratedFormSelectInput
                key={input.id}
                input={input}
              />
            );
          }

          if (input.type === 'image-server-upload') {
            return (
              <GeneratedFormImageServerUploadInput
                key={input.id}
                input={input}
              />
            );
          }

          return null;
        })}
        <Button type="submit">
          Erstellen
        </Button>
      </Form>
    </Formik>
  );
};

export default GeneratedClientForm;
