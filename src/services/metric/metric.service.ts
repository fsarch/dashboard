import { fetchService } from "@/utils/fetchService";
import {
  TMetricTypeDto,
  TMetricDto,
  TMeasurementDto,
  TAggregateMeasurementsDto,
  TAggregateResult,
  TPaginationResultDto,
  TPaginationParams,
  TMetricsQueryParams,
  TMeasurementsQueryParams,
  TCreateMetricTypeDto,
  TCreateMetricDto,
} from "./metric.type";

// Metric Types

export const listMetricTypes = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TMetricTypeDto>> => {
  const response = await fetchService(
    `/metric-types?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

export const getMetricTypeById = async (
  id: string,
  serviceId: string
): Promise<TMetricTypeDto> => {
  const response = await fetchService(`/metric-types/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

export const createMetricType = async (
  dto: TCreateMetricTypeDto,
  serviceId: string
): Promise<TMetricTypeDto> => {
  const response = await fetchService(
    `/metric-types`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return response.json();
};

// Metrics

export const listMetrics = async (
  params: TMetricsQueryParams,
  serviceId: string
): Promise<TPaginationResultDto<TMetricDto>> => {
  const metricTypeIdParam = params.metricTypeId ? `&metricTypeId=${params.metricTypeId}` : '';
  const response = await fetchService(
    `/metrics?page=${params.page}&pageSize=${params.pageSize}${metricTypeIdParam}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

export const getMetricById = async (
  id: string,
  serviceId: string
): Promise<TMetricDto> => {
  const response = await fetchService(`/metrics/${id}`, undefined, {
    serviceId,
  });
  return response.json();
};

export const createMetric = async (
  dto: TCreateMetricDto,
  serviceId: string
): Promise<TMetricDto> => {
  const response = await fetchService(
    `/metrics`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return response.json();
};

// Measurements

export const listMeasurements = async (
  metricId: string,
  params: TMeasurementsQueryParams,
  serviceId: string
): Promise<TPaginationResultDto<TMeasurementDto>> => {
  const response = await fetchService(
    `/metrics/${metricId}/measurements?limit=${params.limit}&offset=${params.offset}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

export const getMeasurementById = async (
  metricId: string,
  measurementId: string,
  serviceId: string
): Promise<TMeasurementDto> => {
  // Note: The OpenAPI spec doesn't have a GET /measurements/{id} endpoint
  // This would need to be implemented if needed
  const response = await fetchService(
    `/metrics/${metricId}/measurements`,
    undefined,
    { serviceId }
  );
  const result = await response.json();
  return result.data.find((m: TMeasurementDto) => m.metricId === measurementId);
};

// Aggregate

export const aggregateMeasurements = async (
  metricId: string,
  dto: TAggregateMeasurementsDto,
  serviceId: string
): Promise<TAggregateResult> => {
  const response = await fetchService(
    `/metrics/${metricId}/measurements/_actions/aggregate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return response.json();
};

export const metricService = {
  // Metric Types
  listMetricTypes,
  getMetricTypeById,
  // Metrics
  listMetrics,
  getMetricById,
  // Measurements
  listMeasurements,
  getMeasurementById,
  // Aggregate
  aggregateMeasurements,
};
