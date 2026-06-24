'use client';

import React from 'react';
import { TPaginationResultDto, TMetricDto } from '@/services/metric-server/metric-server.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type MetricsListProps = {
  metrics: TPaginationResultDto<TMetricDto>;
  serviceId: string;
  metricTypeId: string;
  page: number;
  pageSize: number;
};

const MetricsList: React.FunctionComponent<MetricsListProps> = ({
  metrics,
  serviceId,
  metricTypeId,
  page,
  pageSize,
}) => {
  const { data, metadata } = metrics;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/metric-server/${serviceId}/metric?metricTypeId=${metricTypeId}&page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/metric-server/${serviceId}/metric?metricTypeId=${metricTypeId}&page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((metric) => (
              <Link
                key={metric.id}
                href={`/metric-server/${serviceId}/metric/${metric.id}`}
              >
                <ListItem>
                  <strong>{metric.name}</strong> - ID: {metric.id}
                  <br />
                  <small>
                    Type: {metric.metricTypeId} |
                    Ext-ID: {metric.externalId || 'N/A'} |
                    Created: {new Date(metric.creationTime).toLocaleString()}
                  </small>
                </ListItem>
              </Link>
            ))}
          </List>
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={metadata.totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            hasNextPage={page < metadata.totalPages}
          />
        </>
      ) : (
        <p>Keine Metrics gefunden für diesen Metric Type.</p>
      )}
    </div>
  );
};

export default MetricsList;
