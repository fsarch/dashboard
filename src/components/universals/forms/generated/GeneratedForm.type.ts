export type TGeneratedFormBaseInput = {
  id: string;
  label: string;
};

export type TGeneratedFormTextInput = TGeneratedFormBaseInput & {
  type: 'text',
};

export type TGeneratedFormSelectConstantData = {
  $type: 'constant';
  value: Array<{ id: string; value: string; label: string; }>;
};

export type TGeneratedFormSelectInput = TGeneratedFormBaseInput & {
  type: 'select';
  data: {
    $type: 'datasource';
    value: string;
  } | TGeneratedFormSelectConstantData;
};

export type TGeneratedFormStringConstantData = {
  $type: 'constant';
  value: string;
};

export type TGeneratedFormImageServerUploadInput = TGeneratedFormBaseInput & {
  type: 'image-server-upload';
  imageServerAdminUrl: {
    $type: 'datasource';
    value: string;
  } | TGeneratedFormStringConstantData;
  transformResponse: TJsonataExpression;
};

export type TGeneratedFormInput = TGeneratedFormTextInput | TGeneratedFormSelectInput | TGeneratedFormImageServerUploadInput;

export type TGeneratedFormInitialValues = { $type: 'jsonata', value: string } | { $type: 'constant'; value: Record<string, unknown>; };

export type TJsonataExpression = {
  $type: 'jsonata';
  value: string;
};

export type TGeneratedFormDataSource = {
  $type: 'fetch',
  path: string;
  method: string;
  transformResponse: TJsonataExpression;
};

export type TGeneratedFormEndpoint = {
  path: string | TJsonataExpression;
  method: string;
  body: string | TJsonataExpression;
}

export type TGeneratedFormDefinition = {
  inputs: Array<TGeneratedFormInput>;
  endpoint: TGeneratedFormEndpoint;
  initialValues: TGeneratedFormInitialValues;
  dataSources: Record<string, TGeneratedFormDataSource>;
};
