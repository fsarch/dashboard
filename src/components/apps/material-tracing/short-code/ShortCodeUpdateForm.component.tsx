import 'server-only';

import type React from 'react';
import { SHORT_CODE_UPDATE_FORM_DEFINITION } from '@/components/apps/material-tracing/short-code/ShortCodeUpdateForm.form';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';

type ShortCodeUpdateFormProps = {
  args: {
    shortCode: {
      code: string;
      hint?: string;
    };
  };
};

const ShortCodeUpdateForm: React.FunctionComponent<
  ShortCodeUpdateFormProps
> = ({ args }) => {
  return (
    <GeneratedForm definition={SHORT_CODE_UPDATE_FORM_DEFINITION} args={args} />
  );
};

export default ShortCodeUpdateForm;
