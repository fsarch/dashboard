import 'server-only';

import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MANUFACTURER_UPDATE_FORM_DEFINITION } from "@/components/apps/material-tracing/manufacturer/ManufacturerUpdateForm.form";

type ManufacturerUpdateFormProps = {
  args: {
    manufacturer: {
      id: string;
      name: string;
      hint?: string;
      externalId?: string;
    },
  };
};

const ManufacturerUpdateForm: React.FunctionComponent<ManufacturerUpdateFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={MANUFACTURER_UPDATE_FORM_DEFINITION}
      args={args}
    />
  );
};

export default ManufacturerUpdateForm;
