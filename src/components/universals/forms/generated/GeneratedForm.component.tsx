import 'server-only';

import React from 'react';
import {
  TGeneratedFormDefinition,
  TGeneratedFormInitialValues, TGeneratedFormSubmitResponse,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import GeneratedClientForm from "@/components/universals/forms/generated/GeneratedClientForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";

type GeneratedFormProps = {
  definition: TGeneratedFormDefinition;
  args?: Record<string, unknown>;
  context?: Record<string, unknown>;
};

const GeneratedForm: React.FunctionComponent<GeneratedFormProps> = async ({
  definition,
  args,
  context,
}) => {
  const evaluatedDefinition = await generatedFormUtils.evaluateDefinition(definition, { args, context });

  async function handleSubmit(data: TGeneratedFormInitialValues): Promise<TGeneratedFormSubmitResponse> {
    'use server';

    return generatedFormUtils.executePostSubmitAction(definition, data, args, context);
  }
console.log('evaluatedDefinition.initialValues', evaluatedDefinition.initialValues);
  return (
    <GeneratedClientForm
      definition={evaluatedDefinition.inputs}
      buttons={evaluatedDefinition.buttons}
      initialValues={evaluatedDefinition.initialValues}
      onSubmit={handleSubmit}
    />
  );
};

export default GeneratedForm;
