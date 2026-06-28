// Metric Types

export type TCreateMetricTypeDto = {
  name: string;
  externalId?: string;
};

export type TMetricTypeDto = {
  id: string;
  name: string;
  externalId: string | null;
  creationTime: string;
};

// Metrics

export type TCreateMetricDto = {
  name: string;
  metricTypeId: string;
  externalId?: string;
};

export type TMetricDto = {
  id: string;
  name: string;
  metricTypeId: string;
  externalId: string | null;
  creationTime: string;
  deletionTime: string | null;
};

// Measurements

export type TCreateMeasurementDto = {
  metricId: string;
  logTime: object;
  value: number;
  meta?: object;
  isWarmTier?: boolean;
};

export type TMeasurementDto = {
  metricId: string;
  logTime: string;
  value: number;
  meta: object | null;
  isWarmTier: boolean;
};

// Aggregate

export type TAggregationType = 'avg' | 'sum' | 'min' | 'max' | 'count';
export type TIntervalType = 'hour' | 'day' | 'week' | 'month';

export type TAggregateMeasurementsDto = {
  startTime: object;
  endTime: object;
  interval: TIntervalType;
  aggregation: TAggregationType;
  warmTierOnly: boolean;
};

// Aggregated measurement for a single time interval
export type TAggregatedMeasurementDto = {
  startTime: string;
  endTime: string;
  value: number;
};

// Aggregate result is an array of aggregated measurements
export type TAggregateResult = TAggregatedMeasurementDto[];

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

export type TPaginationParams = {
  page: number;
  pageSize: number;
};

// Query params for metrics list
export type TMetricsQueryParams = {
  metricTypeId?: string;
  page: number;
  pageSize: number;
  isDeleted?: boolean;
};

// Query params for measurements list
export type TMeasurementsQueryParams = {
  limit: number;
  offset: number;
};
