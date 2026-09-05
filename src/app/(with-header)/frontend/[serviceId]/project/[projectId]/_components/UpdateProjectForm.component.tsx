import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { UPDATE_PROJECT_FORM } from '../_forms/update-project.form';

type UpdateProjectFormProps = {
  args: {
    project: {
      id: string;
      name: string;
      description?: string;
      currentVersionId?: string;
    };
  };
};

const UpdateProjectForm: React.FunctionComponent<UpdateProjectFormProps> = ({ args }) => {
  return (
    <GeneratedForm
      definition={UPDATE_PROJECT_FORM}
      args={args}
    />
  );
};

export default UpdateProjectForm;
