import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { CREATE_VERSION_FORM } from '../_forms/create-version.form';

type CreateVersionFormProps = {
  args: { projectId: string };
};

const CreateVersionForm: React.FunctionComponent<CreateVersionFormProps> = ({ args }) => {
  return (
    <GeneratedForm
      definition={CREATE_VERSION_FORM}
      args={args}
    />
  );
};

export default CreateVersionForm;
