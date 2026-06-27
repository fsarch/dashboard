// service: metric-server
// interface: MetricServerApi

namespace FsArchApiCatalog {
  // Metric Type DTOs
  type CreateMetricTypeDto = {
    /**
     * Name of the metric type
     */
    name: string;
    /**
     * External identifier for the metric type
     */
    externalId?: string;
  };

  type MetricTypeDto = {
    /**
     * Unique identifier of the metric type
     */
    id: string;
    /**
     * Name of the metric type
     */
    name: string;
    /**
     * External identifier for the metric type
     */
    externalId: string | null;
    /**
     * Creation timestamp
     */
    creationTime: string;
  };

  // Metric DTOs
  type CreateMetricDto = {
    /**
     * Name of the metric
     */
    name: string;
    /**
     * ID of the metric type this metric belongs to
     */
    metricTypeId: string;
    /**
     * External identifier for the metric
     */
    externalId?: string;
  };

  type MetricDto = {
    /**
     * Unique identifier of the metric
     */
    id: string;
    /**
     * Name of the metric
     */
    name: string;
    /**
     * ID of the metric type
     */
    metricTypeId: string;
    /**
     * External identifier for the metric
     */
    externalId: string | null;
    /**
     * Creation timestamp
     */
    creationTime: string;
  };

  // Measurement DTOs
  type CreateMeasurementDto = {
    /**
     * ID of the metric this measurement belongs to
     */
    metricId: string;
    /**
     * Timestamp when the measurement was logged
     */
    logTime: string | Date;
    /**
     * Numeric value of the measurement
     */
    value: number;
    /**
     * Additional metadata for the measurement
     */
    meta?: Record<string, unknown>;
  };

  type MeasurementDto = {
    /**
     * Metric ID
     */
    metricId: string;
    /**
     * Log timestamp
     */
    logTime: string;
    /**
     * Measurement value
     */
    value: number;
    /**
     * Additional metadata
     */
    meta: Record<string, unknown> | null;
  };

  type BulkCreateMeasurementResultDto = Array<{
    /**
     * The metric ID of the created measurement
     */
    metricId: string;
    /**
     * The log time of the created measurement
     */
    logTime: string;
  }>;

  // Aggregate DTOs
  type AggregationType = 'avg' | 'sum' | 'min' | 'max' | 'count';
  type IntervalType = 'hour' | 'day' | 'week' | 'month';

  type AggregateMeasurementsDto = {
    /**
     * Start time for the aggregation range
     */
    startTime: string | Date;
    /**
     * End time for the aggregation range
     */
    endTime: string | Date;
    /**
     * Time interval for aggregation
     */
    interval: IntervalType;
    /**
     * Type of aggregation to perform
     */
    aggregation: AggregationType;
  };

  type AggregatedMeasurementDto = {
    /**
     * Start time of the aggregation interval
     */
    startTime: string;
    /**
     * End time of the aggregation interval
     */
    endTime: string;
    /**
     * Aggregated value for the interval
     */
    value: number;
  };

  // MetricType API Interface
  interface MetricTypeApi {
    /**
     * Create a new metric type
     * @param data The metric type data
     */
    create(data: CreateMetricTypeDto): Promise<MetricTypeDto>;

    /**
     * Get a single metric type by ID
     * @param id The metric type ID
     */
    get(id: string): Promise<MetricTypeDto>;

    /**
     * Delete a metric type by ID
     * @param id The metric type ID
     */
    delete(id: string): Promise<void>;
  }

  // Metric API Interface
  interface MetricApi {
    /**
     * Create a new metric
     * @param data The metric data
     */
    create(data: CreateMetricDto): Promise<MetricDto>;

    /**
     * Get a single metric by ID
     * @param id The metric ID
     */
    get(id: string): Promise<MetricDto>;

    /**
     * Delete a metric by ID
     * @param id The metric ID
     */
    delete(id: string): Promise<void>;
  }

  // Measurement API Interface
  interface MeasurementApi {
    /**
     * Create a single measurement for a specific metric
     * @param metricId The metric ID
     * @param data The measurement data
     */
    create(metricId: string, data: CreateMeasurementDto): Promise<MeasurementDto>;

    /**
     * Bulk create multiple measurements
     * @param measurements Array of measurement data
     */
    bulkCreate(measurements: Array<CreateMeasurementDto>): Promise<BulkCreateMeasurementResultDto>;

    /**
     * Aggregate measurements for a specific metric
     * @param metricId The metric ID
     * @param data The aggregation parameters
     */
    aggregate(metricId: string, data: AggregateMeasurementsDto): Promise<Array<AggregatedMeasurementDto>>;
  }

  declare interface MetricServerApi {
    /**
     * Manage metric types
     */
    readonly metricTypes: MetricTypeApi;

    /**
     * Manage metrics
     */
    readonly metrics: MetricApi;

    /**
     * Manage measurements
     */
    readonly measurements: MeasurementApi;
  }
}
