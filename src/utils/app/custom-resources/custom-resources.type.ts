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
