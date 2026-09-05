import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { UPDATE_VERSION_FORM } from '../_forms/update-version.form';

type UpdateVersionFormProps = {
  args: {
    version: {
      id: string;
      projectId: string;
      name?: string;
      description?: string;
      externalId?: string;
    };
  };
};

const UpdateVersionForm: React.FunctionComponent<UpdateVersionFormProps> = ({ args }) => {
  return (
    <GeneratedForm
      definition={UPDATE_VERSION_FORM}
      args={args}
    />
  );
};

export default UpdateVersionForm;
