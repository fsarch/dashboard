import 'server-only';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MATERIAL_CREATE_FORM } from "@/services/material-tracing/material.forms";

export const MaterialCreateForm = async () => {
  return (
    <GeneratedForm
      definition={MATERIAL_CREATE_FORM}
    />
  );
};
