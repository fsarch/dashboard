import { EServiceType } from '@/utils/configuration.type';

export type TCustomResourceAuth = {
  type: 'credential-propagation';
};

export type TCustomResourceApiRequest = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  auth: TCustomResourceAuth;
};

export type TCustomResourceListRoute = {
  request: TCustomResourceApiRequest;
  enablePagination?: boolean;
};

export type TCustomResourceGetRoute = {
  request: TCustomResourceApiRequest;
};

export type TCustomResourceApiRoutes = {
  list?: TCustomResourceListRoute;
  get?: TCustomResourceGetRoute;
};

export type TCustomResourceDefinition = {
  id: string;
  name: string;
  description: string;
  apiRoutes: TCustomResourceApiRoutes;
};

export type TCustomResourceListResponseDto = {
  data: TCustomResourceDefinition[];
};

export type TCustomResourcePaginationMetadata = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TCustomResourceInstanceListResult = {
  data: unknown[];
  metadata: TCustomResourcePaginationMetadata;
};

export type TCustomResourceCapableService = {
  id: string;
  name?: string;
  type: EServiceType;
};

// Eine Custom-Resource-Definition, angereichert um den App-Typ, unter dem
// sie geführt wird (für die service-übergreifende Übersicht/Detailseite im
// Development-Bereich, siehe development/custom-resources).
export type TCustomResourceDefinitionWithAppType = {
  appType: EServiceType;
  // Service-Instanz, über die diese Definition geladen wurde - dient nur
  // als Beispiel, um die (laut Backend app-typ-weit identische) Definition
  // überhaupt abzurufen. Die eigentliche Instanz-Auswahl erfolgt separat
  // und service-übergreifend über den SelectCustomResourceDialog.
  exampleServiceId: string;
  resource: TCustomResourceDefinition;
};
