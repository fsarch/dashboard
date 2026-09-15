import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { UPDATE_PARAMETER_FORM } from '../_forms/update-parameter.form';
import { ParameterDto } from '@/services/image-editor-server/image-editor-server.type';

type UpdateParameterFormProps = {
  args: {
    projectId: string;
    versionId: string;
    parameter: ParameterDto;
  };
};

const UpdateParameterForm: React.FunctionComponent<UpdateParameterFormProps> = ({ args }) => {
  return (
    <GeneratedForm
      definition={UPDATE_PARAMETER_FORM}
      args={args}
    />
  );
};

export default UpdateParameterForm;
