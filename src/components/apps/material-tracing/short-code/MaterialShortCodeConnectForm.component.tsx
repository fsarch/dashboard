import React from 'react';
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { generatedFormUtils } from "@/components/universals/forms/generated/GeneratedForm.utils";
import {
  MATERIAL_SHORT_CODE_CONNECT_FORM
} from "@/components/apps/material-tracing/short-code/MaterialShortCodeConnectFrom.form";

type ShortCodeConnectFormProps = {
  args: Record<string, unknown>;
};

export const createManufacturer = generatedFormUtils.createServerAction(MATERIAL_SHORT_CODE_CONNECT_FORM);

const MaterialShortCodeConnectForm: React.FunctionComponent<ShortCodeConnectFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm
      onSubmit={createManufacturer}
      definition={MATERIAL_SHORT_CODE_CONNECT_FORM}
    />
  );
};

export default MaterialShortCodeConnectForm;
