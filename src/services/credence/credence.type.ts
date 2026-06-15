// Scope Types
export type TScopeTypeDto = {
  id: string;
  scopeDataTypeId: number;
  name: string;
  key: string;
  scoreFactor: string;
  externalId?: string;
};

export type TScopeTypeIpScopeTypeDto = {
  id: string;
  enableAutoAsnCreation: boolean;
  autoAsnScopeTypeId?: string | null;
  autoAsnIpAsnDatasourceId?: string | null;
  enableAutoSubnetCreation: boolean;
  autoSubnetScopeTypeId?: string | null;
  autoSubnetIp4SubnetMask?: number | null;
  autoSubnetIp6SubnetMask?: number | null;
};

export type TScopeTypeReadDto = TScopeTypeDto & {
  ipScopeType?: TScopeTypeIpScopeTypeDto | null;
};

export type TScopeTypeCreateDto = {
  scopeDataTypeId: number;
  name: string;
  key: string;
  scoreFactor: string;
  externalId?: string;
};

// Scope Data Types
export type TScopeDataTypeDto = {
  id: number;
  name: string;
  externalId?: string;
};

export type TScopeDataTypeCreateDto = {
  name: string;
  externalId?: string;
};

// IP-ASN Datasources
export type TIpAsnDatasourceDto = {
  id: string;
  name: string;
  externalId?: string;
};

export type TIpAsnDatasourceCreateDto = {
  name: string;
  externalId?: string;
};

// IP-ASN Data
export type TIpAsnDataDto = {
  id: string;
  ipAsnDatasourceId: string;
  externalId?: string;
  prefix: string;
  asn: number;
  asnOrganization: string;
};

export type TIpAsnDataCreateBodyDto = {
  externalId?: string;
  prefix: string;
  asn: number;
  asnOrganization: string;
};

// Event Types
export type TEventTypeDto = {
  id: string;
  name: string;
  defaultScoreFactor: string;
  defaultTtlSeconds: number;
};

export type TEventTypeCreateDto = {
  name: string;
  defaultScoreFactor: string;
  defaultTtlSeconds: number;
};

// Scope Values
export type TScopeValueType = 'ip' | 'asn' | 'subnet' | 'browserFingerprint' | 'customFingerprint';

export type TScopeValueDto = {
  type: TScopeValueType;
  value: string;
  externalId?: string;
};

// Events
export type TEventCreateDto = {
  eventTypeId: string;
  scopes: TScopeValueDto[];
  externalId?: string;
};

export type TEventDto = {
  id: string;
  eventTypeId: string;
  scoreFactor: string;
  creationTime: string;
  expirationTime: string | null;
  externalId?: string | null;
};

// Pagination
export type TPaginationResultMetaDto = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginationResultDto<T> = {
  data: T[];
  metadata: TPaginationResultMetaDto;
};

// Pagination query params
export type TPaginationParams = {
  page: number;
  pageSize: number;
};
