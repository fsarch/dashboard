'use client';

import React from 'react';
import { TPaginationResultDto, TAggregationModeTypeDto } from '@/services/credence/credence.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AggregationModeTypesListProps = {
  aggregationModeTypes: TPaginationResultDto<TAggregationModeTypeDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const AggregationModeTypesList: React.FunctionComponent<AggregationModeTypesListProps> = ({
  aggregationModeTypes,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = aggregationModeTypes;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/credence/${serviceId}/aggregation-mode-type?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/credence/${serviceId}/aggregation-mode-type?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((aggregationModeType) => (
              <Link
                key={aggregationModeType.id}
                href={`/credence/${serviceId}/aggregation-mode-type/${aggregationModeType.id}`}
              >
                <ListItem>
                  <strong>{aggregationModeType.name}</strong>
                  {aggregationModeType.externalId && <> - External ID: <code>{aggregationModeType.externalId}</code></>}
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
        <p>Keine Aggregation Mode Types gefunden.</p>
      )}
    </div>
  );
};

export default AggregationModeTypesList;
