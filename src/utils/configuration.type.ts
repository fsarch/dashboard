export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
  DATATABLE = 'datatable',
  PIM = 'product',
  IMAGE = 'image',
  MATERIAL_TRACING = 'material-tracing',
  CUSTOM_APP = 'custom-app',
  PDF_RENDER = 'pdf-render',
  FUNCTION = 'function',
  PRINTER = 'printer',
  AI = 'ai',
  EMAIL_SERVER = 'email',
  FRONTIER = 'frontier',
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
  worker_url?: string;
}

export type TCustomAppConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.CUSTOM_APP,
  url: string;
  path: string;
};

export type TPrinterConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.PRINTER,
  url: string;
}

export type TAIConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.AI,
  url: string;
}

export type TEmailServerConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.EMAIL_SERVER,
  url: string;
}

export type TFrontierConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.FRONTIER,
  url: string;
}

export type TServiceConfiguration = TCustomAppConfiguration
  | TCustomerCommunicationServiceConfiguration
  | TDatatableServiceConfiguration
  | TProductServiceConfiguration
  | TImageServiceConfiguration
  | TMaterialTracingConfiguration
  | TPdfRenderConfiguration
  | TFunctionConfiguration
  | TPrinterConfiguration
  | TAIConfiguration
  | TEmailServerConfiguration
  | TFrontierConfiguration;

export type TUacOperator = 'includes' | 'equals';

export type TUacMapping = {
  path: string;
  value: string;
  operator: TUacOperator;
  permissions: string[];
};

export type TUacConfiguration = {
  type: 'token-based';
  mappings: TUacMapping[];
};

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
  defaults: Record<string, { id: string; }>;
  theme?: {
    primary_color?: string;
    background_color?: string;
  };
  uac?: TUacConfiguration;
};
