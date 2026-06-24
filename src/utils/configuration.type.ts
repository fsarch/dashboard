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
  WATCHTOWER = 'watchtower',
  BOT_PROTECTION = 'bot-protection',
  METRIC_SERVER = 'metric-server',
}

export type TCustomerCommunicationServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.CUSTOMER_COMMUNICATION,
  url: string;
};

export type TDatatableServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.DATATABLE,
  url: string;
};

export type TProductServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.PIM,
  url: string;
};

export type TImageServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.IMAGE,
  url: string;
};

export type TMaterialTracingConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.MATERIAL_TRACING,
  url: string;
};

export type TPdfRenderConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.PDF_RENDER,
  url: string;
};

export type TFunctionConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.FUNCTION,
  url: string;
  worker_url?: string;
};

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
};

export type TAIConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.AI,
  url: string;
};

export type TEmailServerConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.EMAIL_SERVER,
  url: string;
};

export type TFrontierConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.FRONTIER,
  url: string;
};

export type TWatchtowerConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.WATCHTOWER,
  url: string;
};

export type TBotProtectionConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.BOT_PROTECTION,
  url: string;
};

export type TMetricServerConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.METRIC_SERVER,
  url: string;
};

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
  | TFrontierConfiguration
  | TWatchtowerConfiguration
  | TBotProtectionConfiguration
  | TMetricServerConfiguration;

export type TUacComparisonOperator = 'includes' | 'equals';

export type TUacAppPermission = {
  type: 'app';
  value: {
    type: EServiceType | '*';
    id: string | '*';
  };
};

export type TUacPermission = string | TUacAppPermission;

export type TUacMapMapping = {
  path: string;
  operator: 'map';
  mappings: Array<{
    key: string;
    permissions: TUacPermission[];
  }>;
};

export type TUacComparisonMapping = {
  path: string;
  value: string;
  operator: TUacComparisonOperator;
  permissions: TUacPermission[];
};

export type TUacMapping = TUacComparisonMapping | TUacMapMapping;

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
