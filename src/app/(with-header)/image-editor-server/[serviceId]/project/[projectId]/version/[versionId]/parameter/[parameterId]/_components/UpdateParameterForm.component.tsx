import type React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import type { ParameterDto } from '@/services/image-editor-server/image-editor-server.type';
import { UPDATE_PARAMETER_FORM } from '../_forms/update-parameter.form';

type UpdateParameterFormProps = {
  args: {
    projectId: string;
    versionId: string;
    parameter: ParameterDto;
  };
};

const UpdateParameterForm: React.FunctionComponent<
  UpdateParameterFormProps
> = ({ args }) => {
  return <GeneratedForm definition={UPDATE_PARAMETER_FORM} args={args} />;
};

export default UpdateParameterForm;
