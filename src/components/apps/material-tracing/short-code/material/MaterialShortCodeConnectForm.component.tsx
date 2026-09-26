import 'server-only';

import type React from 'react';
import { MATERIAL_SHORT_CODE_CONNECT_FORM } from '@/components/apps/material-tracing/short-code/material/MaterialShortCodeConnectFrom.form';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';

type ShortCodeConnectFormProps = {
  args: Record<string, unknown>;
};

const MaterialShortCodeConnectForm: React.FunctionComponent<
  ShortCodeConnectFormProps
> = ({ args }) => {
  return (
    <GeneratedForm definition={MATERIAL_SHORT_CODE_CONNECT_FORM} args={args} />
  );
};

export default MaterialShortCodeConnectForm;
