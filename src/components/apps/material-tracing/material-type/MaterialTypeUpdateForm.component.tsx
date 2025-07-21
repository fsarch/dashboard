'use server';

import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MATERIAL_TYPE_UPDATE_FORM_DEFINITION } from "@/components/apps/material-tracing/material-type/MaterialTypeUpdateForm.form";

type MaterialTypeUpdateFormProps = {
  args: {
    materialType: {
      id: string;
      name: string;
      hint?: string;
      externalId?: string;
    },
  };
};

const MaterialTypeUpdateForm: React.FunctionComponent<MaterialTypeUpdateFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={MATERIAL_TYPE_UPDATE_FORM_DEFINITION}
      args={args}
    />
  );
};

export default MaterialTypeUpdateForm;