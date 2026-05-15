import React from 'react';
import { TView, TViewGroupView } from "@/components/apps/custom-app/custom-app.type";
import CustomAppListView from "@/components/apps/custom-app/views/list/CustomAppListView.component";
import FormView from "@/components/apps/custom-app/views/form/FormView";
import ButtonView from "@/components/apps/custom-app/views/button/ButtonView.component";
import IframeView from "@/components/apps/custom-app/views/iframe/IframeView.component";
import { SectionView } from "@/components/apps/custom-app/views/section/SectionView.component";

export const renderViews = async (views: Array<TView>, { dataSource, context }: {
  dataSource: Record<string, unknown>;
  context?: Record<string, unknown>;
}) => {
  return views.map((view, index) => (
    <View
      key={index}
      view={view}
      dataSource={dataSource}
      context={context}
    />
  ));
};

export type TRenderViewsFunc = typeof renderViews;

type CustomAppViewGroupViewComponentProps = {
  view: TViewGroupView;
  dataSource: Record<string, unknown>;
  context?: Record<string, unknown>;
};

export const ViewGroup: React.FunctionComponent<CustomAppViewGroupViewComponentProps> = async ({
  view,
  dataSource,
  context,
}) => {
  return (
    <div>
      {await renderViews(view.views, { dataSource, context })}
    </div>
  )
};

type CustomAppViewComponentProps = {
  view: TView;
  dataSource: Record<string, unknown>;
  context?: Record<string, unknown>;
};

export const View: React.FunctionComponent<CustomAppViewComponentProps> = async ({
  view,
  dataSource,
  context,
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
      context={context}
    />;
  }

  if (view.$type === 'form') {
    return <FormView
      view={view}
      dataSource={dataSource}
      context={context}
    />
  }

  if (view.$type === 'button') {
    return <ButtonView
      view={view}
      dataSource={dataSource}
    />
  }

  if (view.$type === 'section') {
    return <SectionView
      view={view}
      dataSource={dataSource}
      renderViews={renderViews}
      context={context}
    />
  }

  if (view.$type === 'iframe') {
    return <IframeView
      view={view}
      dataSource={dataSource}
    />
  }

  if (view.$type === 'paragraph') {
    return <p>{typeof view.text === 'string' ? view.text : view.text.value}</p>;
  }

  return (
    <div>
      Unknown type
    </div>
  );
};
