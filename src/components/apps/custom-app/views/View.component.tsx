import React from 'react';
import { TView, TViewGroupView } from "@/components/apps/custom-app/custom-app.type";
import CustomAppListView from "@/components/apps/custom-app/views/list/CustomAppListView.component";
import FormView from "@/components/apps/custom-app/views/form/FormView";
import ButtonView from "@/components/apps/custom-app/views/button/ButtonView.component";
import IframeView from "@/components/apps/custom-app/views/iframe/IframeView.component";

type CustomAppViewGroupViewComponentProps = {
  view: TViewGroupView;
  dataSource: Record<string, unknown>;
};

export const ViewGroup: React.FunctionComponent<CustomAppViewGroupViewComponentProps> = async ({
  view,
  dataSource,
}) => {
  return (
    <div>
      {view.views.map((vi, index) => (
        <View
          key={index}
          view={vi}
          dataSource={dataSource}
        />
      ))}
    </div>
  )
};

type CustomAppViewComponentProps = {
  view: TView;
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

  if (view.$type === 'form') {
    return <FormView
      view={view}
      dataSource={dataSource}
    />
  }

  if (view.$type === 'button') {
    return <ButtonView
      view={view}
      dataSource={dataSource}
    />
  }

  if (view.$type === 'iframe') {
    return <IframeView
      view={view}
      dataSource={dataSource}
    />
  }

  return (
    <div>
      Unknown type
    </div>
  );
};
