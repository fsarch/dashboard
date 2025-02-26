'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MANUFACTURER_CREATE_FORM } from "@/services/material-tracing/manufacturer.forms";

export const ManufacturerCreateForm = async () => {
  return (
    <GeneratedForm
      definition={MANUFACTURER_CREATE_FORM}
    />
  );
};
