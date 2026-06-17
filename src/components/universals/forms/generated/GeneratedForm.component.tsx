import 'server-only';

import React from 'react';
import {
  TGeneratedFormDefinition,
  TGeneratedFormInitialValues, TGeneratedFormSubmitResponse,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import GeneratedClientForm from "@/components/universals/forms/generated/GeneratedClientForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";
import { uacUtils } from '@/utils/uac.utils';

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
  const isDev = await uacUtils.isDeveloper();

  const {
    definition: evaluatedDefinition,
    debugInfo,
  } = await generatedFormUtils.evaluateDefinition(definition, {
    args,
    context: { ...context, args },
    collectDebugInfo: isDev,
  });

  async function handleSubmit(data: TGeneratedFormInitialValues): Promise<TGeneratedFormSubmitResponse> {
    'use server';

    return generatedFormUtils.executePostSubmitAction(definition, data, args, { ...context, args });
  }

  return (
    <GeneratedClientForm
      definition={evaluatedDefinition.inputs}
      buttons={evaluatedDefinition.buttons}
      initialValues={evaluatedDefinition.initialValues}
      onSubmit={handleSubmit}
      isDev={isDev}
      debugInfo={debugInfo}
    />
  );
};

export default GeneratedForm;
