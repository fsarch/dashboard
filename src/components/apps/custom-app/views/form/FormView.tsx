import React from 'react';
import { TFormView } from "@/components/apps/custom-app/custom-app.type";

type FormViewProps = {
  view: TFormView;
  dataSource: Record<string, unknown>;
};

const FormView: React.FunctionComponent<FormViewProps> = ({
  view,
  dataSource,
}) => {
  return (
    <div>
      <pre>
        {JSON.stringify(view, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(dataSource, null, 2)}
      </pre>
    </div>
  );
};

export default FormView;
