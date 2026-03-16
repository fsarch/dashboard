import 'server-only';

import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { SHORT_CODE_UPDATE_FORM_DEFINITION } from "@/components/apps/material-tracing/short-code/ShortCodeUpdateForm.form";

type ShortCodeUpdateFormProps = {
  args: {
    shortCode: {
      code: string;
      hint?: string;
    },
  };
};

const ShortCodeUpdateForm: React.FunctionComponent<ShortCodeUpdateFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={SHORT_CODE_UPDATE_FORM_DEFINITION}
      args={args}
    />
  );
};

export default ShortCodeUpdateForm;
