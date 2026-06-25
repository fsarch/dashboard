'use client';

import React from 'react';
import { TPaginationResultDto, TMetricTypeDto } from '@/services/metric/metric.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';

type MetricTypesListProps = {
  metricTypes: TPaginationResultDto<TMetricTypeDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const MetricTypesList: React.FunctionComponent<MetricTypesListProps> = ({
  metricTypes,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = metricTypes;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/metric/${serviceId}/metric-type?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/metric/${serviceId}/metric-type?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href={`/metric/${serviceId}/metric-type/create`} passHref>
          <Button type="button">
            Create Metric Type
          </Button>
        </Link>
      </div>
      {data.length > 0 ? (
        <>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
            <List>
              {data.map((metricType) => (
                <Link
                  key={metricType.id}
                  href={`/metric/${serviceId}/metric?metricTypeId=${metricType.id}`}
                >
                  <ListItem>
                    <strong>{metricType.name}</strong> - ID: {metricType.id}
                    {metricType.externalId && <span> - Ext-ID: {metricType.externalId}</span>}
                    <br />
                    <small>Created: {new Date(metricType.creationTime).toLocaleString()}</small>
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
        <p>Keine Metric Types gefunden.</p>
      )}
    </div>
  );
};

export default MetricTypesList;
