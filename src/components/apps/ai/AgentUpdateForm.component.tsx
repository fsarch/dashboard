import 'server-only';

import type React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { AGENT_UPDATE_FORM } from '@/services/ai/agents.forms';
import type { AgentDto } from '@/services/ai/agents.type';

type AgentUpdateFormProps = {
  args: {
    agent: AgentDto;
  };
};

const AgentUpdateForm: React.FunctionComponent<AgentUpdateFormProps> = ({
  args,
}) => <GeneratedForm definition={AGENT_UPDATE_FORM} args={args} />;

export default AgentUpdateForm;
