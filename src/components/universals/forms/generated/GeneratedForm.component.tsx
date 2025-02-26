import 'server-only';

import React from 'react';
import {
  TGeneratedFormDefinition,
  TGeneratedFormInitialValues, TGeneratedFormSubmitResponse,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import GeneratedClientForm from "@/components/universals/forms/generated/GeneratedClientForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";

type GeneratedFormProps = {
  onSubmit: (data: TGeneratedFormInitialValues) => Promise<TGeneratedFormSubmitResponse>;
  definition: TGeneratedFormDefinition;
};

const GeneratedForm: React.FunctionComponent<GeneratedFormProps> = async ({
  onSubmit,
  definition,
}) => {
  const evaluatedDefinition = await generatedFormUtils.evaluateDefinition(definition);

  return (
    <GeneratedClientForm
      definition={evaluatedDefinition.inputs}
      initialValues={evaluatedDefinition.initialValues}
      onSubmit={onSubmit}
    />
  );
};

export default GeneratedForm;
