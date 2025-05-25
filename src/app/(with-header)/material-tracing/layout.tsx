import React, { PropsWithChildren } from 'react';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

type LayoutProps = PropsWithChildren<{

}>;

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
}) => {
  return (
    <DefaultPage>
      {children}
    </DefaultPage>
  );
};

export default Layout;
