import 'server-only';

import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { buildMaterialTypeCreateForm } from '@/services/material-tracing/material-type.forms';
import { getCurrentServiceId } from '@/utils/configuration.utils';

export const MaterialTypeCreateForm = async () => {
  const serviceId = await getCurrentServiceId();

  return <GeneratedForm definition={buildMaterialTypeCreateForm(serviceId)} />;
};
