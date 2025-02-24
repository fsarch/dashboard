'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";
import { MATERIAL_TYPE_CREATE_FORM } from "@/services/material-tracing/material-type.forms";

export const createMaterialType = generatedFormUtils.createServerAction(MATERIAL_TYPE_CREATE_FORM);


export const MaterialTypeCreateForm = async () => {
  return (
    <GeneratedForm
      onSubmit={createMaterialType}
      definition={MATERIAL_TYPE_CREATE_FORM}
    />
  );
};
