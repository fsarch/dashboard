import 'server-only';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { METRIC_CREATE_FORM } from "@/services/metric/metric.forms";

export const MetricCreateForm = async () => {
  return (
    <GeneratedForm
      definition={METRIC_CREATE_FORM}
    />
  );
};
