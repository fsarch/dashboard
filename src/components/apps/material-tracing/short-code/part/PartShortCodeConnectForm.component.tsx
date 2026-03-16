import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import {
  PART_SHORT_CODE_CONNECT_FORM
} from "@/components/apps/material-tracing/short-code/part/PartShortCodeConnectFrom.form";
import 'server-only';

type ShortCodeConnectFormProps = {
  args: Record<string, unknown>;
};

const PartShortCodeConnectForm: React.FunctionComponent<ShortCodeConnectFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      definition={PART_SHORT_CODE_CONNECT_FORM}
      args={args}
    />
  );
};

export default PartShortCodeConnectForm;
