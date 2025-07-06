import React from 'react';
import ActionButtonClient
  from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/ActionButtonClient.component";
import { fetchService } from "@/utils/fetchService";

type ActionButtonProps = {
  name: string;
  path: string;
};

const ActionButton: React.FunctionComponent<ActionButtonProps> = ({
  name,
  path,
}) => {
  const handleClick = async () => {
    'use server';

    const response = await fetchService(path, {
      method: "POST",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error('non successful action');
    }

    return data.result;
  };

  return (
    <ActionButtonClient
      onClick={handleClick}
      name={name}
    />
  );
};

export default ActionButton;
