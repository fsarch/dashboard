'use client';

import React from 'react';
import { TPaginationResultDto, TMetricDto } from '@/services/metric/metric.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';

type MetricsListProps = {
  metrics: TPaginationResultDto<TMetricDto>;
  serviceId: string;
  metricTypeId?: string;
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

  const metricTypeIdParam = metricTypeId ? `&metricTypeId=${metricTypeId}` : '';

  const handlePageChange = (newPage: number) => {
    router.push(`/metric/${serviceId}/metric?page=${newPage}&pageSize=${pageSize}${metricTypeIdParam}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/metric/${serviceId}/metric?page=1&pageSize=${newPageSize}${metricTypeIdParam}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href={`/metric/${serviceId}/metric/create${metricTypeId ? `?metricTypeId=${metricTypeId}` : ''}`} passHref>
          <Button type="button">
            Create Metric
          </Button>
        </Link>
      </div>
      {data.length > 0 ? (
        <>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
            <List>
              {data.map((metric) => (
                <Link
                  key={metric.id}
                  href={`/metric/${serviceId}/metric/${metric.id}`}
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
          </div>
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
        <p>Keine Metrics gefunden.</p>
      )}
    </div>
  );
};

export default MetricsList;
