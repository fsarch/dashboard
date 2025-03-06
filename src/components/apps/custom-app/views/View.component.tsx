import React from 'react';
import { TCustomAppView, TViewGroupView } from "@/components/apps/custom-app/custom-app.type";
import CustomAppListView from "@/components/apps/custom-app/views/list/CustomAppListView.component";
import { TCustomAppConfiguration } from "@/utils/configuration.type";
import { customAppUtils } from "@/components/apps/custom-app/custom-app.utils";

type CustomAppViewGroupViewComponentProps = {
  view: TViewGroupView;
  dataSource: Record<string, unknown>;
};

export const ViewGroup: React.FunctionComponent<CustomAppViewGroupViewComponentProps> = async ({
  view,
}) => {
  return (
    <div>
      Test
    </div>
  )
};

type CustomAppViewComponentProps = {
  view: TCustomAppView;
  dataSource: Record<string, unknown>;
};

export const View: React.FunctionComponent<CustomAppViewComponentProps> = async ({
  view,
  dataSource,
}) => {
  if (view.$type === 'list') {
    return <CustomAppListView
      dataSource={dataSource}
      view={view}
    />
  }

  if (view.$type === 'view-group') {
    return <ViewGroup
      view={view}
      dataSource={dataSource}
    />;
  }

  return (
    <div>
      Unknown type
    </div>
  );
};
