import type {
  TGeneratedFormAction,
  TGeneratedFormDataSource, TGeneratedFormEndpoint, TGeneratedFormInitialValues, TGeneratedFormInput,
  TJsonataExpression
} from "@/components/universals/forms/generated/GeneratedForm.type";
import type { AppNavigation, AppNavigationItem } from "@/constants/app.type";

export type TCustomAppClickHandler = {
  $type: 'open-service-view';
  path: TJsonataExpression;
} | ({
  $type: 'fetch';
} & TGeneratedFormEndpoint);

export type TCustomAppClickHandlerResponse = {
  $type: 'open-url',
  url: string;
};

export type TCustomAppClickHandlerFunc = (
  data: {
    query: Record<string, string>;
  }
) => Promise<TCustomAppClickHandlerResponse | null>;

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
  datasource?: Record<string, TGeneratedFormDataSource>;
};

export type TViewGroupView = {
  $type: 'view-group';
  views: Array<TView>;
};

export type TFormView = {
  $type: 'form';
  inputs: Array<TGeneratedFormInput>;
  endpoint: TGeneratedFormEndpoint;
  initialValues: TGeneratedFormInitialValues;
  postEndpointActions?: Array<TGeneratedFormAction>;
};

export type TButtonView = {
  $type: 'button';
  label: string;
  click: TCustomAppClickHandler;
};

export type TIframeView = {
  $type: 'iframe';
  url: string | TJsonataExpression;
};

export type TSectionView = {
  $type: 'section';
  views: Array<TView>;
  label: string;
};

export type TParagraphView = {
  $type: 'paragraph';
  text: string | TJsonataExpression;
};

export type TView = TViewGroupView | TListView | TFormView | TButtonView | TIframeView | TSectionView | TParagraphView;

export type TCustomAppListView = TListView & TCustomAppBaseView;

export type TCustomAppViewGroupView = TViewGroupView & TCustomAppBaseView;

export type TCustomAppView = TCustomAppListView | TCustomAppViewGroupView;

export type TCustomAppConfig = {
  views: Array<TCustomAppView>;
  mainView: string;
  name: string;
  navigation?: Array<AppNavigationItem>;
  navigations?: Array<AppNavigation>;
};
