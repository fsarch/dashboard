export type TGeneratedFormBaseInput = {
  id: string;
  label: string;
};

export type TGeneratedFormTextInputButton = {
  $type: 'qr-scanner';
};

export type TGeneratedFormTextInput = TGeneratedFormBaseInput & {
  $type: 'text',
  buttons?: Array<TGeneratedFormTextInputButton>;
  isEnabled?: boolean,
};

export type TGeneratedFormTimeInput = TGeneratedFormBaseInput & {
  $type: 'time',
  isEnabled?: boolean,
};

export type TGeneratedFormNumberInput = TGeneratedFormBaseInput & {
  $type: 'number',
  isEnabled?: boolean,
};

export type TGeneratedFormSelectConstantData = {
  $type: 'constant';
  value: Array<{ id: string; value: string; label: string; }>;
};

export type TGeneratedFormSelectInput = TGeneratedFormBaseInput & {
  $type: 'select';
  enableSearch?: boolean;
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
  $type: 'image-server-upload';
  imageServerAdminUrl: {
    $type: 'datasource';
    value: string;
  } | TGeneratedFormStringConstantData;
  transformResponse: TJsonataExpression;
  preferCapture?: 'environment' | 'user';
};

export type TGeneratedNestedForm = TGeneratedFormBaseInput & {
  $type: 'nested-form';
  isArray?: boolean;
  addInitialValues?: Record<string, unknown>;
  inputs: Array<TGeneratedFormInput>;
};

export type TGeneratedFormCheckboxInput = TGeneratedFormBaseInput & {
  $type: 'checkbox';
  isEnabled?: boolean;
};

export type TGeneratedFormInput = TGeneratedFormTextInput | TGeneratedFormSelectInput | TGeneratedFormImageServerUploadInput | TGeneratedNestedForm | TGeneratedFormTimeInput | TGeneratedFormNumberInput | TGeneratedFormCheckboxInput;

export type TGeneratedFormInitialValues = { $type: 'jsonata', value: string } | Record<string, unknown>;

export type TJsonataExpression = {
  $type: 'jsonata';
  value: string;
};

export type TGeneratedFormDataSource = {
  $type: 'fetch',
  path: string | TJsonataExpression;
  method: string;
  transformResponse?: TJsonataExpression;
  headers?: Record<string, string>;
};

export type TGeneratedFormEndpoint = {
  path: string | TJsonataExpression;
  method: string;
  body?: TJsonataExpression;
  headers?: Record<string, string>;
}

export type TGeneratedFormAction = {
  $type: 'redirect',
  url: TGeneratedFormStringConstantData | TJsonataExpression,
};

export type TSubmitButtonsFormDefinition = {
  submitButtonText: string;
};

export type TGeneratedFormDefinition = {
  inputs: Array<TGeneratedFormInput>;
  endpoint: TGeneratedFormEndpoint;
  initialValues: TGeneratedFormInitialValues;
  dataSources?: Record<string, TGeneratedFormDataSource>;
  postEndpointActions?: Array<TGeneratedFormAction>;
  buttons?: TSubmitButtonsFormDefinition;
};

export type TGeneratedFormSubmitResponse = {
  response: {
    body: Record<string, unknown>;
  };
  actions: Array<TGeneratedFormAction>;
};
