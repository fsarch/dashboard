'use server';

import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import {
  MATERIAL_SHORT_CODE_DELETE_FORM
} from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeDeleteFrom.form";

type ShortCodeDeleteFormProps = {
  args: {
    materialId: string;
    shortCode: string;
  };
};

const MaterialShortCodeDeleteForm: React.FunctionComponent<ShortCodeDeleteFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={MATERIAL_SHORT_CODE_DELETE_FORM}
      args={args}
    />
  );
};

export default MaterialShortCodeDeleteForm;
