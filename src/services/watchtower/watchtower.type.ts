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
  aggregationModeId?: string | null;
};

export type TEventTypeCreateDto = {
  name: string;
  defaultScoreFactor: string;
  defaultTtlSeconds: number;
  aggregationModeId?: string | null;
};

// Aggregation Mode Types
export type TAggregationModeTypeDto = {
  id: string;
  name: string;
  externalId?: string | null;
};

// Aggregation Modes
export type TAggregationModeDto = {
  id: string;
  name: string;
  aggregationModeTypeId: string;
  maxFactor?: string | null;
  externalId?: string | null;
  creationTime: string;
  deletionTime?: string | null;
};

export type TAggregationModeReadDto = TAggregationModeDto & {
  aggregationModeType: TAggregationModeTypeDto;
};

export type TAggregationModeCreateDto = {
  name: string;
  aggregationModeTypeId: string;
  maxFactor?: string | null;
  externalId?: string | null;
};

export type TAggregationModeUpdateDto = {
  name?: string;
  aggregationModeTypeId?: string;
  maxFactor?: string | null;
  externalId?: string | null;
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

// Scope DTOs
export type TIpScopeDto = {
  id: string;
  address: string;
};

export type TAsnScopeDto = {
  id: string;
  asn: number;
  asnOrganization?: string | null;
};

export type TSubnetScopeDto = {
  id: string;
  address: string;
};

export type TScopeDto = {
  id: string;
  scopeTypeId: string;
  creationTime: string;
  externalId?: string | null;
  scopeType: TScopeTypeDto;
  ipScope?: TIpScopeDto | null;
  asnScope?: TAsnScopeDto | null;
  subnetScope?: TSubnetScopeDto | null;
};

// Score and Event DTOs
export type TEventScopeDto = {
  id: string;
  scopeId: string;
  creationTime: string;
  deletionTime?: string | null;
  event: TEventDto;
  eventType: TEventTypeDto;
};

export type TScopeSpecDto = {
  id: string;
  type: string;
  value: string;
};

export type TScoreCalculateRequestDto = {
  scopes: TScopeSpecDto[];
};

export type TEventTypeScoreDto = {
  eventTypeId: string;
  score: number;
};

export type TScopeScoreDto = {
  scopeId: string;
  scopeTypeId: string;
  scopeRisk: number;
  weightedScope: number;
  eventTypeScores: TEventTypeScoreDto[];
};

export type TScoreCalculationResultDto = {
  scopeScores: TScopeScoreDto[];
  finalRisk: number;
};

// Pagination query params
export type TPaginationParams = {
  page: number;
  pageSize: number;
};
