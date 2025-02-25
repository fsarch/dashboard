'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";
import { MATERIAL_CREATE_FORM } from "@/services/material-tracing/material.forms";

export const createMaterial = generatedFormUtils.createServerAction(MATERIAL_CREATE_FORM);


export const MaterialCreateForm = async () => {
  return (
    <GeneratedForm
      onSubmit={createMaterial}
      definition={MATERIAL_CREATE_FORM}
    />
  );
};
