import 'server-only';

import type React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { AGENT_CREATE_FORM } from '@/services/ai/agents.forms';

export const AgentCreateForm: React.FunctionComponent = () => (
  <GeneratedForm definition={AGENT_CREATE_FORM} />
);
