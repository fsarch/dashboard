import type { TView } from "@/components/apps/custom-app/custom-app.type";

/**
 * Base type for all GeneratedForm inputs.
 * Every input field requires a unique `id` and a `label`.
 */
export type TGeneratedFormBaseInput = {
  /** Unique identifier for the input field */
  id: string;
  /** Display label for the input field */
  label: string;
};

export type TGeneratedFormTextInputButton = {
  /** Button type identifier - currently only 'qr-scanner' is supported */
  $type: 'qr-scanner';
};

export type TGeneratedFormTextInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'text' for text inputs */
  $type: 'text',
  /** Optional buttons to display with the text input (e.g., QR scanner) */
  buttons?: Array<TGeneratedFormTextInputButton>;
  /** Whether the input is enabled and editable */
  isEnabled?: boolean,
};

export type TGeneratedFormTextAreaInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'textarea' for multiline text inputs */
  $type: 'textarea',
  /** Whether the input is enabled and editable */
  isEnabled?: boolean,
};

export type TGeneratedFormPasswordInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'password' for password inputs */
  $type: 'password',
  /** Whether the input is enabled and editable */
  isEnabled?: boolean,
};

export type TGeneratedFormColorInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'color' for color picker inputs */
  $type: 'color',
  /** Whether the input is enabled and editable */
  isEnabled?: boolean,
};

export type TGeneratedFormTimeInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'time' for time inputs */
  $type: 'time',
  /** Whether the input is enabled and editable */
  isEnabled?: boolean,
};

export type TGeneratedFormNumberInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'number' for numeric inputs */
  $type: 'number',
  /** Whether the input is enabled and editable */
  isEnabled?: boolean,
};

export type TGeneratedFormSelectConstantData = {
  /** Data type identifier - always 'constant' for static data */
  $type: 'constant';
  /** Array of select options with id, value (must be string), and label */
  value: Array<{ id: string; value: string; label: string; }>;
};

/**
 * Select input for dropdown selections.
 * - `data` can be a reference to a DataSource (`{ $type: 'datasource', value: 'dataSourceKey' }`)
 *   or constant values (`{ $type: 'constant', value: [...] }`)
 * - `enableSearch` enables search functionality for large lists
 * - IMPORTANT: `value` in options MUST be a string (use `id + ""` for numeric IDs)
 */
export type TGeneratedFormSelectInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'select' for dropdown inputs */
  $type: 'select';
  /** Enable search functionality for large dropdown lists */
  enableSearch?: boolean;
  /** Data source for select options - can be a datasource reference or constant values */
  data: {
    $type: 'datasource';
    value: string;
  } | TGeneratedFormSelectConstantData;
};

export type TGeneratedFormStringConstantData = {
  /** Data type identifier - always 'constant' for static string data */
  $type: 'constant';
  /** Constant string value */
  value: string;
};

export type TGeneratedFormImageServerUploadInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'image-server-upload' for image upload inputs */
  $type: 'image-server-upload';
  /** Image server admin URL - can be from a datasource or constant */
  imageServerAdminUrl: {
    $type: 'datasource';
    value: string;
  } | TGeneratedFormStringConstantData;
  /** JSONata expression to transform the upload response - MUST return object with { body: ... } */
  transformResponse: TJsonataExpression;
  /** Preferred capture method: 'environment' or 'user' */
  preferCapture?: 'environment' | 'user';
};

export type TGeneratedFormFileUploadInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'file-upload' for generic file upload inputs */
  $type: 'file-upload';
  /** Accept attribute for file types (e.g., '.zip,application/zip') */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Preferred capture method: 'environment' or 'user' */
  capture?: 'environment' | 'user';
};

/**
 * Nested form for arrays or objects.
 * - `isArray: true` for array fields (e.g., Tags, Scopes)
 * - `addInitialValues` defines default values for new array entries
 * - `inputs` defines the fields of the nested object
 */
export type TGeneratedNestedForm = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'nested-form' for nested structures */
  $type: 'nested-form';
  /** Treat as array of nested objects */
  isArray?: boolean;
  /** Default values for new array entries */
  addInitialValues?: Record<string, unknown>;
  /** List of input fields for the nested object */
  inputs: Array<TGeneratedFormInput>;
};

export type TGeneratedFormCheckboxInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'checkbox' for checkbox inputs */
  $type: 'checkbox';
  /** Whether the input is enabled and editable */
  isEnabled?: boolean;
  /** Visual style of the input - a native checkbox (default) or a toggle/switch. Behaves identically either way. */
  variant?: 'checkbox' | 'toggle';
};

export type TGeneratedFormLinkCardInput = TGeneratedFormBaseInput & {
  /** Input type identifier - always 'link-card' for link card inputs */
  $type: 'link-card';
  /** URL for the link - can be a constant string or JSONata expression */
  href?: string | TJsonataExpression;
  /** Views to display in the link card */
  views: Array<TView>;
};

/** Union type of all supported input types */
export type TGeneratedFormInput = TGeneratedFormTextInput | TGeneratedFormTextAreaInput | TGeneratedFormPasswordInput | TGeneratedFormColorInput | TGeneratedFormSelectInput | TGeneratedFormImageServerUploadInput | TGeneratedFormFileUploadInput | TGeneratedNestedForm | TGeneratedFormTimeInput | TGeneratedFormNumberInput | TGeneratedFormCheckboxInput | TGeneratedFormLinkCardInput;

/** Initial values for the form - can be a JSONata expression or a static object */
export type TGeneratedFormInitialValues = { $type: 'jsonata', value: string } | Record<string, unknown>;

export type TJsonataExpression = {
  /** Expression type identifier - always 'jsonata' */
  $type: 'jsonata';
  /** JSONata expression string for data transformation */
  value: string;
};

/**
 * Data source for select inputs and other data-dependent fields.
 * - `path`: Relative path to the service (e.g., `/v1/categories`)
 * - `method`: HTTP method (usually `'GET'`)
 * - `transformResponse`: JSONata expression to transform the API response
 *   ⚠️ IMPORTANT: MUST return an object with `{ body: ... }`!
 *   Example: `{ "body": data.{ "id": id, "value": id + "", "label": name } }`
 * - `headers`: Optional additional request headers
 */
export type TGeneratedFormDataSource = {
  /** Data source type identifier - always 'fetch' for API calls */
  $type: 'fetch',
  /** Relative path to the service API endpoint */
  path: string | TJsonataExpression;
  /** HTTP method for the request (usually 'GET') */
  method: string;
  /** Optional JSONata expression to transform the API response - MUST return object with { body: ... } */
  transformResponse?: TJsonataExpression;
  /** Optional additional request headers */
  headers?: Record<string, string>;
};

export type TGeneratedFormEndpoint = {
  /** Relative path to the service API endpoint (e.g., '/v1/entities') */
  path: string | TJsonataExpression;
  /** HTTP method for the request (POST, PUT, PATCH, DELETE) */
  method: string;
  /** Optional request body as JSONata expression to transform form data */
  body?: TJsonataExpression;
  /** Optional additional request headers */
  headers?: Record<string, string>;
}

export type TGeneratedFormAction = {
  /** Action type - currently only 'redirect' is supported */
  $type: 'redirect',
  /** Redirect URL - can be a constant string or JSONata expression using form data */
  url: TGeneratedFormStringConstantData | TJsonataExpression,
};

export type TSubmitButtonsFormDefinition = {
  /** Custom text for the submit button */
  submitButtonText: string;
};

export type TGeneratedFormDefinition = {
  /** List of form input field definitions */
  inputs: Array<TGeneratedFormInput>;
  /** API endpoint configuration for form submission */
  endpoint: TGeneratedFormEndpoint;
  /** Initial form values - can be a JSONata expression or static object */
  initialValues: TGeneratedFormInitialValues;
  /** Optional data sources for select inputs and other data-dependent fields */
  dataSources?: Record<string, TGeneratedFormDataSource>;
  /** Optional actions to execute after successful form submission (e.g., redirect) */
  postEndpointActions?: Array<TGeneratedFormAction>;
  /** Optional customization for submit buttons */
  buttons?: TSubmitButtonsFormDefinition;
};

export type TGeneratedFormSubmitResponse = {
  /** API response containing the result data */
  response: {
    /** The response body - can be any structure depending on the API */
    body: Record<string, unknown>;
  };
  /** Actions to execute after submission (e.g., redirect) */
  actions: Array<TGeneratedFormAction>;
};

export type TDataSourceJsonataResponse = {
  status: number;
  statusText: string;
  body: unknown;
};

type TDataSourceResponseDebugInfo = {
  url: string;
  method: string;
  status: number;
  statusText: string;
  body: {
    rawJson: unknown;
  };
  transformation?: {
    isError: false;
    expression: string;
    input: TDataSourceJsonataResponse;
    output: TDataSourceJsonataResponse;
  } | {
    isError: true;
    expression: string;
    input: TDataSourceJsonataResponse;
    error: unknown;
  };
}

export type TEvaluationDebugInfo = {
  dataSourceResponses: Record<string, TDataSourceResponseDebugInfo>;
};

export type TEvaluationResult = {
  definition: TGeneratedFormDefinition;
  debugInfo?: TEvaluationDebugInfo;
};
