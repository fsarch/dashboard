'use client';

import React from 'react';
import { TPaginationResultDto, TScopeTypeDto } from '@/services/credence/credence.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';

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

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((scopeType) => (
              <Link
                key={scopeType.id}
                href={`/credence/${serviceId}/scope-type/${scopeType.id}`}
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
            basePath={`/credence/${serviceId}/scope-type`}
          />
        </>
      ) : (
        <p>Keine Scope Types gefunden.</p>
      )}
    </div>
  );
};

export default ScopeTypesList;
