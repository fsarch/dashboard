export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
  DATATABLE = 'datatable',
  PIM = 'product',
  IMAGE = 'image',
  MATERIAL_TRACING = 'material-tracing',
  CUSTOM_APP = 'custom-app',
  PDF_RENDER = 'pdf-render',
  FUNCTION = 'function',
  FUNCTION_GATEWAY = 'function-gateway',
  PRINTER = 'printer',
  AI = 'ai',
  EMAIL_SERVER = 'email',
  FRONTIER = 'frontier',
  WATCHTOWER = 'watchtower',
  BOT_PROTECTION = 'bot-protection',
  METRIC = 'metric',
  FRONTEND = 'frontend',
  CALENDAR = 'calendar',
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
  type: EServiceType.FUNCTION;
  url: string;
  worker_url?: string;
};

export type TFunctionGatewayConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.FUNCTION_GATEWAY;
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

export type TMetricConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.METRIC,
  url: string;
};

export type TFrontendConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.FRONTEND,
  url: string;
};

export type TCalendarConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.CALENDAR,
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
  | TFunctionGatewayConfiguration
  | TPrinterConfiguration
  | TAIConfiguration
  | TEmailServerConfiguration
  | TFrontierConfiguration
  | TWatchtowerConfiguration
  | TBotProtectionConfiguration
  | TMetricConfiguration
  | TFrontendConfiguration
  | TCalendarConfiguration;

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

export type TTracingConfiguration = {
  enabled: boolean;
  serviceName?: string;
  sampleRatio?: number;
  exporter?: TTracingExporterConfiguration;
};

export type TTracingExporterConfiguration =
  | TTracingConsoleExporterConfiguration
  | TTracingOtlpHttpExporterConfiguration
  | TTracingOtlpGrpcExporterConfiguration;

export type TTracingConsoleExporterConfiguration = {
  type: 'console';
};

export type TTracingOtlpHttpExporterConfiguration = {
  type: 'otlp-http';
  url: string;
  headers?: Record<string, string>;
};

export type TTracingOtlpGrpcExporterConfiguration = {
  type: 'otlp-grpc';
  url: string;
  headers?: Record<string, string>;
};

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
  defaults: Record<string, { id: string; }>;
  theme?: {
    primary_color?: string;
    background_color?: string;
  };
  uac?: TUacConfiguration;
  tracing?: TTracingConfiguration;
};
