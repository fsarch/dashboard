import 'server-only';

import type React from 'react';
import { MATERIAL_UPDATE_FORM_DEFINITION } from '@/components/apps/material-tracing/material/MaterialUpdateForm.form';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';

type MaterialUpdateFormProps = {
  args: {
    material: {
      id: string;
      name: string;
      hint?: string;
      externalId?: string;
      archiveTime?: string | null;
    };
    materialType: {
      name: string;
      path: string;
    };
    manufacturer: {
      name: string;
      path: string;
    };
  };
};

const MaterialUpdateForm: React.FunctionComponent<MaterialUpdateFormProps> = ({
  args,
}) => {
  return (
    <GeneratedForm definition={MATERIAL_UPDATE_FORM_DEFINITION} args={args} />
  );
};

export default MaterialUpdateForm;
