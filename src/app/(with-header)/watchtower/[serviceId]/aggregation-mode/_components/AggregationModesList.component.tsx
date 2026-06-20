'use client';

import React from 'react';
import { TPaginationResultDto, TAggregationModeDto } from '@/services/watchtower/watchtower.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AggregationModesListProps = {
  aggregationModes: TPaginationResultDto<TAggregationModeDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const AggregationModesList: React.FunctionComponent<AggregationModesListProps> = ({
  aggregationModes,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = aggregationModes;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/watchtower/${serviceId}/aggregation-mode?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/watchtower/${serviceId}/aggregation-mode?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((aggregationMode) => (
              <Link
                key={aggregationMode.id}
                href={`/watchtower/${serviceId}/aggregation-mode/${aggregationMode.id}`}
              >
                <ListItem>
                  <strong>{aggregationMode.name}</strong> - Aggregation Mode Type: {aggregationMode.aggregationModeTypeId}
                  {aggregationMode.maxFactor && <> - Max Factor: {aggregationMode.maxFactor}</>}
                  {aggregationMode.externalId && <> - External ID: <code>{aggregationMode.externalId}</code></>}
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
        <p>Keine Aggregation Modes gefunden.</p>
      )}
    </div>
  );
};

export default AggregationModesList;
