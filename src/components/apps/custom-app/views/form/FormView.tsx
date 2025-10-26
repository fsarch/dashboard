import React from 'react';
import { TFormView } from "@/components/apps/custom-app/custom-app.type";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";

type FormViewProps = {
  view: TFormView;
  dataSource: Record<string, unknown>;
  context?: Record<string, unknown>;
};

const FormView: React.FunctionComponent<FormViewProps> = ({
  view,
  context,
}) => {
  return (
    <div>
      <GeneratedForm
        definition={view}
        context={context}
      />
    </div>
  );
};

export default FormView;
