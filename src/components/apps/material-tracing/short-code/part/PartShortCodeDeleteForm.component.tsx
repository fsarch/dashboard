import type React from 'react';
import { PART_SHORT_CODE_DELETE_FORM } from '@/components/apps/material-tracing/short-code/part/PartShortCodeDeleteFrom.form';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import 'server-only';

type ShortCodeDeleteFormProps = {
  args: {
    partId: string;
    shortCode: string;
  };
};

const PartShortCodeDeleteForm: React.FunctionComponent<
  ShortCodeDeleteFormProps
> = ({ args }) => {
  return <GeneratedForm definition={PART_SHORT_CODE_DELETE_FORM} args={args} />;
};

export default PartShortCodeDeleteForm;
