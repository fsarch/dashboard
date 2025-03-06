import React from 'react';
import { TCustomAppView } from "@/components/apps/custom-app/custom-app.type";
import { TCustomAppConfiguration } from "@/utils/configuration.type";
import { customAppUtils } from "@/components/apps/custom-app/custom-app.utils";
import { View } from "@/components/apps/custom-app/views/View.component";

type CustomAppViewComponentProps = {
  view: TCustomAppView;
  app: TCustomAppConfiguration;
};

const CustomAppViewComponent: React.FunctionComponent<CustomAppViewComponentProps> = async ({
  view,
  app,
}) => {
  const dataSource = await customAppUtils.evaluateDatasources(view.datasource, {
    baseUrl: app.url,
    context: {},
  });

  return (
    <View
      view={view}
      dataSource={dataSource}
    />
  );
};

export default CustomAppViewComponent;
