'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MATERIAL_TYPE_CREATE_FORM } from "@/services/material-tracing/material-type.forms";

export const MaterialTypeCreateForm = async () => {
  return (
    <GeneratedForm
      definition={MATERIAL_TYPE_CREATE_FORM}
    />
  );
};
