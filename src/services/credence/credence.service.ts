import { fetchService } from "@/utils/fetchService";
import {
  TScopeTypeDto,
  TScopeTypeReadDto,
  TScopeTypeCreateDto,
  TScopeDataTypeDto,
  TScopeDataTypeCreateDto,
  TIpAsnDatasourceDto,
  TIpAsnDatasourceCreateDto,
  TIpAsnDataDto,
  TIpAsnDataCreateBodyDto,
  TEventTypeDto,
  TEventTypeCreateDto,
  TEventDto,
  TEventCreateDto,
  TAggregationModeDto,
  TAggregationModeTypeDto,
  TAggregationModeReadDto,
  TAggregationModeCreateDto,
  TAggregationModeUpdateDto,
  TPaginationResultDto,
  TPaginationParams,
} from "./credence.type";

// Scope Data Types
const listScopeDataTypes = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TScopeDataTypeDto>> => {
  const response = await fetchService(
    `/v1/scope-data-types?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getScopeDataTypeById = async (
  id: number,
  serviceId: string
): Promise<TScopeDataTypeDto> => {
  const response = await fetchService(`/v1/scope-data-types/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

const createScopeDataType = async (
  dto: TScopeDataTypeCreateDto,
  serviceId: string
): Promise<TScopeDataTypeDto> => {
  const response = await fetchService(`/v1/scope-data-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
  return response.json();
};

// Scope Types
const listScopeTypes = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TScopeTypeDto>> => {
  const response = await fetchService(
    `/v1/scope-types?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getScopeTypeById = async (
  id: string,
  serviceId: string
): Promise<TScopeTypeReadDto> => {
  const response = await fetchService(`/v1/scope-types/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

const createScopeType = async (
  dto: TScopeTypeCreateDto,
  serviceId: string
): Promise<void> => {
  await fetchService(`/v1/scope-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
};

// IP-ASN Datasources
const listIpAsnDatasources = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TIpAsnDatasourceDto>> => {
  const response = await fetchService(
    `/v1/ip-asn/datasources?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getIpAsnDatasourceById = async (
  id: string,
  serviceId: string
): Promise<TIpAsnDatasourceDto> => {
  const response = await fetchService(`/v1/ip-asn/datasources/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

const createIpAsnDatasource = async (
  dto: TIpAsnDatasourceCreateDto,
  serviceId: string
): Promise<TIpAsnDatasourceDto> => {
  const response = await fetchService(`/v1/ip-asn/datasources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
  return response.json();
};

// IP-ASN Data
const listIpAsnData = async (
  datasourceId: string,
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TIpAsnDataDto>> => {
  const response = await fetchService(
    `/v1/ip-asn/datasources/${datasourceId}/data?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getIpAsnDataById = async (
  datasourceId: string,
  id: string,
  serviceId: string
): Promise<TIpAsnDataDto> => {
  const response = await fetchService(
    `/v1/ip-asn/datasources/${datasourceId}/data/${id}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const createIpAsnData = async (
  datasourceId: string,
  dto: TIpAsnDataCreateBodyDto,
  serviceId: string
): Promise<TIpAsnDataDto> => {
  const response = await fetchService(
    `/v1/ip-asn/datasources/${datasourceId}/data`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return response.json();
};

// Event Types
const listEventTypes = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventTypeDto>> => {
  const response = await fetchService(
    `/v1/event-types?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getEventTypeById = async (
  id: string,
  serviceId: string
): Promise<TEventTypeDto> => {
  const response = await fetchService(`/v1/event-types/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

const createEventType = async (
  dto: TEventTypeCreateDto,
  serviceId: string
): Promise<void> => {
  await fetchService(`/v1/event-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
};

// Events
const createEvent = async (
  dto: TEventCreateDto,
  serviceId: string
): Promise<TEventDto> => {
  const response = await fetchService(`/v1/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
  return response.json();
};

// Aggregation Mode Types
const listAggregationModeTypes = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TAggregationModeTypeDto>> => {
  const response = await fetchService(
    `/v1/aggregation-mode-types?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getAggregationModeTypeById = async (
  id: string,
  serviceId: string
): Promise<TAggregationModeTypeDto> => {
  const response = await fetchService(`/v1/aggregation-mode-types/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

// Aggregation Modes
const listAggregationModes = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TAggregationModeDto>> => {
  const response = await fetchService(
    `/v1/aggregation-modes?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getAggregationModeById = async (
  id: string,
  serviceId: string
): Promise<TAggregationModeReadDto> => {
  const response = await fetchService(`/v1/aggregation-modes/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

const createAggregationMode = async (
  dto: TAggregationModeCreateDto,
  serviceId: string
): Promise<TAggregationModeDto> => {
  const response = await fetchService(`/v1/aggregation-modes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
  return response.json();
};

const updateAggregationMode = async (
  id: string,
  dto: TAggregationModeUpdateDto,
  serviceId: string
): Promise<TAggregationModeDto> => {
  const response = await fetchService(`/v1/aggregation-modes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
  return response.json();
};

export const credenceService = {
  // Scope Data Types
  listScopeDataTypes,
  getScopeDataTypeById,
  createScopeDataType,
  // Scope Types
  listScopeTypes,
  getScopeTypeById,
  createScopeType,
  // IP-ASN Datasources
  listIpAsnDatasources,
  getIpAsnDatasourceById,
  createIpAsnDatasource,
  // IP-ASN Data
  listIpAsnData,
  getIpAsnDataById,
  createIpAsnData,
  // Event Types
  listEventTypes,
  getEventTypeById,
  createEventType,
  // Events
  createEvent,
  // Aggregation Mode Types
  listAggregationModeTypes,
  getAggregationModeTypeById,
  // Aggregation Modes
  listAggregationModes,
  getAggregationModeById,
  createAggregationMode,
  updateAggregationMode,
};
