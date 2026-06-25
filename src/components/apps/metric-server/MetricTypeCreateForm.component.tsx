import 'server-only';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { METRIC_TYPE_CREATE_FORM } from "@/services/metric-server/metric-server.forms";

export const MetricTypeCreateForm = async () => {
  return (
    <GeneratedForm
      definition={METRIC_TYPE_CREATE_FORM}
    />
  );
};
