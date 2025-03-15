'use client';

import React, { PropsWithChildren } from 'react';
import {
  TCustomAppClickHandlerFunc,
} from "@/components/apps/custom-app/custom-app.type";
import { customAppClientUtils } from "@/components/apps/custom-app/custom-app-client.utils";

type ClientButtonViewProps = PropsWithChildren<{
  onClick: TCustomAppClickHandlerFunc;
}>;

const ClientButtonView: React.FunctionComponent<ClientButtonViewProps> = ({
  onClick,
  children,
}) => {
  const handleClick = customAppClientUtils.useClickHandler(onClick);

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
};

export default ClientButtonView;
