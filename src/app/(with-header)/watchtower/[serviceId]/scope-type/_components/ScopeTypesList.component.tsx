'use client';

import React from 'react';
import { TPaginationResultDto, TScopeTypeDto } from '@/services/watchtower/watchtower.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ScopeTypesListProps = {
  scopeTypes: TPaginationResultDto<TScopeTypeDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const ScopeTypesList: React.FunctionComponent<ScopeTypesListProps> = ({
  scopeTypes,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = scopeTypes;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/watchtower/${serviceId}/scope-type?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/watchtower/${serviceId}/scope-type?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((scopeType) => (
              <Link
                key={scopeType.id}
                href={`/watchtower/${serviceId}/scope-type/${scopeType.id}`}
              >
                <ListItem>
                  <strong>{scopeType.name}</strong> ({scopeType.key}) - Score Factor: {scopeType.scoreFactor}
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
        <p>Keine Scope Types gefunden.</p>
      )}
    </div>
  );
};

export default ScopeTypesList;
