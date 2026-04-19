'use client';

import React from 'react';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { TMaterial } from '@/services/material-tracing/material.type';
import { TPaginationResult } from '@/services/material-tracing/pagination.type';
import PaginationFetcherComponent from '@/components/universals/pagination/PaginationFetcher.component';
import { PaginationResultType } from '@/components/universals/pagination/PaginationFetcher.type';

type MaterialWithUrl = TMaterial & {
  url: string;
};

type MaterialsListProps = {
  className?: string;
  initialMaterials: MaterialWithUrl[];
  initialTotalItems: number;
  fetchMaterials: (options: {
    skip: number;
    take: number;
    search?: string;
  }) => Promise<TPaginationResult<MaterialWithUrl>>;
  search?: string;
};

const MaterialsList: React.FunctionComponent<MaterialsListProps> = ({
  className,
  initialMaterials,
  initialTotalItems,
  fetchMaterials,
  search,
}) => {
  const initialData: PaginationResultType<MaterialWithUrl> = {
    items: initialMaterials,
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
  }): Promise<PaginationResultType<MaterialWithUrl>> => {
    const result = await fetchMaterials(options);

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
      query={{ search }}
      resetDependencies={[search]}
      loadingText="Loading materials..."
    >
      {(data) => (
        <List>
          {data.items.map((material) => (
            <LinkListItem key={material.id} href={material.url}>
              {material.name}
            </LinkListItem>
          ))}
        </List>
      )}
    </PaginationFetcherComponent>
  );
};

export default MaterialsList;

