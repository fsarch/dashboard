import 'server-only';

import React from 'react';
import { TButtonView } from "@/components/apps/custom-app/custom-app.type";
import { customAppUtils } from "@/components/apps/custom-app/custom-app.utils";
import ClientButtonView from "@/components/apps/custom-app/views/button/ClientButtonView.component";

type ButtonViewProps = {
  view: TButtonView;
  dataSource: Record<string, unknown>;
};

const ButtonView: React.FunctionComponent<ButtonViewProps> = async ({
  view,
}) => {
  const clickAction = await customAppUtils.createClickAction(view.click);

  return (
    <div>
      <ClientButtonView
        onClick={clickAction}
      >
        {view.label}
      </ClientButtonView>
    </div>
  );
};

export default ButtonView;
