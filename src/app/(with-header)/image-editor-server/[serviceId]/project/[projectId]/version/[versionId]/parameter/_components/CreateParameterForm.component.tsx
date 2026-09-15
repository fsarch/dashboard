import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { CREATE_PARAMETER_FORM } from '../_forms/create-parameter.form';

type CreateParameterFormProps = {
  args: { projectId: string; versionId: string };
};

const CreateParameterForm: React.FunctionComponent<CreateParameterFormProps> = ({ args }) => {
  return (
    <GeneratedForm
      definition={CREATE_PARAMETER_FORM}
      args={args}
    />
  );
};

export default CreateParameterForm;
