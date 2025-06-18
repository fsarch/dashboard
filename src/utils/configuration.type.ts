export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
  DATATABLE = 'datatable',
  PIM = 'product',
  IMAGE = 'image',
  MATERIAL_TRACING = 'material-tracing',
  CUSTOM_APP = 'custom-app',
  PDF_RENDER = 'pdf-render',
  FUNCTION = 'function',
}

export type TCustomerCommunicationServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.CUSTOMER_COMMUNICATION,
  url: string;
}

export type TDatatableServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.DATATABLE,
  url: string;
}

export type TProductServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.PIM,
  url: string;
}

export type TImageServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.IMAGE,
  url: string;
}

export type TMaterialTracingConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.MATERIAL_TRACING,
  url: string;
}

export type TPdfRenderConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.PDF_RENDER,
  url: string;
}

export type TFunctionConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.FUNCTION,
  url: string;
}

export type TCustomAppConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.CUSTOM_APP,
  url: string;
  path: string;
};

export type TServiceConfiguration = TCustomAppConfiguration
  | TCustomerCommunicationServiceConfiguration
  | TDatatableServiceConfiguration
  | TProductServiceConfiguration
  | TImageServiceConfiguration
  | TMaterialTracingConfiguration
  | TPdfRenderConfiguration
  | TFunctionConfiguration;

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
  defaults: Record<string, { id: string; }>;
};
