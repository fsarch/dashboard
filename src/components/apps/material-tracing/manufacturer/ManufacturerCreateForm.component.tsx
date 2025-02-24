'use server';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MANUFACTURER_CREATE_FORM } from "@/services/material-tracing/manufacturer.forms";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";

export const createManufacturer = generatedFormUtils.createServerAction(MANUFACTURER_CREATE_FORM);


export const ManufacturerCreateForm = async () => {
  return (
    <GeneratedForm
      onSubmit={createManufacturer}
      definition={MANUFACTURER_CREATE_FORM}
    />
  );
};
