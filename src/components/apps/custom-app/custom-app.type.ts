import {
  TGeneratedFormDataSource,
  TJsonataExpression
} from "@/components/universals/forms/generated/GeneratedForm.type";

export type TCustomAppClickHandler = {
  $type: 'open-service-view'
  path: TJsonataExpression;
};

export type TDataSourceRef = {
  $type: 'datasource';
  value: string;
};

export type TConstantRef = {
  $type: 'constant';
  value: unknown;
};

export type TListView = {
  $type: 'list';
  click: TCustomAppClickHandler;
  data: TDataSourceRef | TConstantRef;
};

export type TListViewItem = {
  id: string;
  label: string;
  value: unknown;
};

export type TCustomAppBaseView = {
  id: string;
  datasource: Record<string, TGeneratedFormDataSource>;
};

export type TViewGroupView = {
  $type: 'view-group';
  views: Array<TView>;
};

export type TView = TViewGroupView | TListView;

export type TCustomAppListView = TListView & TCustomAppBaseView;

export type TCustomAppViewGroupView = TViewGroupView & TCustomAppBaseView;

export type TCustomAppView = TCustomAppListView | TCustomAppViewGroupView;

export type TCustomAppConfig = {
  views: Array<TCustomAppView>;
  mainView: string;
  name: string;
};
