'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";
import { SHORT_CODE_CREATE_FORM } from "@/services/material-tracing/short-code.forms";

export const createShortCode = generatedFormUtils.createServerAction(SHORT_CODE_CREATE_FORM);


export const ShortCodeCreateForm = async () => {
  return (
    <GeneratedForm
      onSubmit={createShortCode}
      definition={SHORT_CODE_CREATE_FORM}
    />
  );
};
