'use client';

import type React from 'react';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import PaginationFetcherComponent from '@/components/universals/pagination/PaginationFetcher.component';
import type { PaginationResultType } from '@/components/universals/pagination/PaginationFetcher.type';
import type { TPaginationResult } from '@/services/material-tracing/pagination.type';
import type { TPart } from '@/services/material-tracing/part.type';
import styles from './PartsList.module.scss';

type PartWithUrl = TPart & {
  url: string;
};

type PartsListProps = {
  className?: string;
  initialParts: PartWithUrl[];
  initialTotalItems: number;
  fetchParts: (options: {
    skip: number;
    take: number;
    search?: string;
    partTypeId?: string;
  }) => Promise<TPaginationResult<PartWithUrl>>;
  search?: string;
  partTypeId?: string;
};

const PartsList: React.FunctionComponent<PartsListProps> = ({
  initialParts,
  initialTotalItems,
  fetchParts,
  className,
  search,
  partTypeId,
}) => {
  const initialData: PaginationResultType<PartWithUrl> = {
    items: initialParts,
    metadata: {
      currentPage: 1,
      pageSize: 25,
      totalItems: initialTotalItems,
      totalPages: Math.ceil(initialTotalItems / 25),
    },
  };

  const getData = async (options: {
    skip: number;
    take: number;
    search?: string;
    partTypeId?: string;
  }): Promise<PaginationResultType<PartWithUrl>> => {
    const result = await fetchParts(options);

    return {
      items: result.data,
      metadata: result.metadata,
    };
  };

  return (
    <PaginationFetcherComponent
      className={className}
      initialData={initialData}
      getData={getData}
      query={{ search, partTypeId }}
      resetDependencies={[search, partTypeId]}
      loadingText="Loading parts..."
    >
      {(data) => (
        <List className={styles.list}>
          {data.items.map((part) => (
            <LinkListItem key={part.id} href={part.url}>
              {part.name}
            </LinkListItem>
          ))}
        </List>
      )}
    </PaginationFetcherComponent>
  );
};

export default PartsList;
