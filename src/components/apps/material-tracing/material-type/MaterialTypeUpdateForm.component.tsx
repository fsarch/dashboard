import 'server-only';

import type React from 'react';
import { MATERIAL_TYPE_UPDATE_FORM_DEFINITION } from '@/components/apps/material-tracing/material-type/MaterialTypeUpdateForm.form';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';

type MaterialTypeUpdateFormProps = {
  args: {
    materialType: {
      id: string;
      name: string;
      hint?: string;
      externalId?: string;
    };
  };
};

const MaterialTypeUpdateForm: React.FunctionComponent<
  MaterialTypeUpdateFormProps
> = ({ args }) => {
  return (
    <GeneratedForm
      definition={MATERIAL_TYPE_UPDATE_FORM_DEFINITION}
      args={args}
    />
  );
};

export default MaterialTypeUpdateForm;
