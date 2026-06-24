'use client';

import React from 'react';
import { TPaginationResultDto, TMetricTypeDto } from '@/services/metric-server/metric-server.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    router.push(`/metric-server/${serviceId}/metric-type?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/metric-server/${serviceId}/metric-type?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((metricType) => (
              <Link
                key={metricType.id}
                href={`/metric-server/${serviceId}/metric?metricTypeId=${metricType.id}`}
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
