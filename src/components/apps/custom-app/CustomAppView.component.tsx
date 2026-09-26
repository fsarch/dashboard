import type React from 'react';
import type { TCustomAppView } from '@/components/apps/custom-app/custom-app.type';
import { customAppUtils } from '@/components/apps/custom-app/custom-app.utils';
import { View } from '@/components/apps/custom-app/views/View.component';
import type { TCustomAppConfiguration } from '@/utils/configuration.type';

type CustomAppViewComponentProps = {
  view: TCustomAppView;
  app: TCustomAppConfiguration;
  searchParams: Record<string, string>;
};

const CustomAppViewComponent: React.FunctionComponent<
  CustomAppViewComponentProps
> = async ({ view, app, searchParams }) => {
  const context = {
    query: searchParams,
  };

  const dataSource = await customAppUtils.evaluateDatasources(view.datasource, {
    baseUrl: app.url,
    context,
  });

  return <View view={view} dataSource={dataSource} context={context} />;
};

export default CustomAppViewComponent;
