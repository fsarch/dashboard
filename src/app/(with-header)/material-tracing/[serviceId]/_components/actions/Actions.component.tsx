import React from 'react';
import { actionService } from "@/services/material-tracing/action.service";
import ActionButton from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/ActionButton.component";
import Section from "@/components/universals/section/Section";

type ActionsProps = {
  type: 'part' | 'manufacturer' | 'material' | 'material_type' | 'part_type' | 'short_code';
  basePath: string;
};

const Actions: React.FunctionComponent<ActionsProps> = async ({
  type,
  basePath,
}) => {
  const actions = await actionService.listActionsByResource(type);

  if (!actions.length) {
    return null;
  }

  return (
    <Section name="Aktionen">
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          name={action.name}
          path={`${basePath}/actions/${action.id}/_actions/execute`}
        />
      ))}
    </Section>
  );
};

export default Actions;
