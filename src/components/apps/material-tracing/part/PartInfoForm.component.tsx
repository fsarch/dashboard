import 'server-only';

import type React from 'react';
import { PART_UPDATE_FORM_DEFINITION } from '@/components/apps/material-tracing/part/PartInfoForm.form';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';

type PartUpdateFormProps = {
  args: {
    part: {
      id: string;
      name: string;
      amount: number;
      externalId?: string;
      availableAmount?: string;
      hint?: string;
      checkoutTime?: string;
      archiveTime?: string | null;
    };
    partType: {
      name: string;
      path?: string;
    };
  };
};

const PartUpdateForm: React.FunctionComponent<PartUpdateFormProps> = ({
  args,
}) => {
  return <GeneratedForm definition={PART_UPDATE_FORM_DEFINITION} args={args} />;
};

export default PartUpdateForm;
