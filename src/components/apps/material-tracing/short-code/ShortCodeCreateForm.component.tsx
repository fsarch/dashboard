'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { SHORT_CODE_CREATE_FORM } from "@/services/material-tracing/short-code.forms";

export const ShortCodeCreateForm = async () => {
  return (
    <GeneratedForm
      definition={SHORT_CODE_CREATE_FORM}
    />
  );
};
