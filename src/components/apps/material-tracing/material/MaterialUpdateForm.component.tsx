'use server';

import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MATERIAL_UPDATE_FORM_DEFINITION } from "@/components/apps/material-tracing/material/MaterialUpdateForm.form";

type MaterialUpdateFormProps = {
  args: {
    material: {
      id: string;
      name: string;
      hint?: string;
      externalId?: string;
    },
  };
};

const MaterialUpdateForm: React.FunctionComponent<MaterialUpdateFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={MATERIAL_UPDATE_FORM_DEFINITION}
      args={args}
    />
  );
};

export default MaterialUpdateForm;