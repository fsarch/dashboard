'use server';

import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import {
  PART_SHORT_CODE_DELETE_FORM,
} from "@/components/apps/material-tracing/short-code/part/PartShortCodeDeleteFrom.form";

type ShortCodeDeleteFormProps = {
  args: {
    partId: string;
    shortCode: string;
  };
};

const PartShortCodeDeleteForm: React.FunctionComponent<ShortCodeDeleteFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={PART_SHORT_CODE_DELETE_FORM}
      args={args}
    />
  );
};

export default PartShortCodeDeleteForm;
