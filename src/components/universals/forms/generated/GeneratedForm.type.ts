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

export type TGeneratedFormInput = TGeneratedFormTextInput | TGeneratedFormSelectInput;

export type TGeneratedFormInitialValues = { $type: 'jsonata', value: string } | Record<string, unknown>;

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
