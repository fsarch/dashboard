'use client';

import React from 'react';
import { TPaginationResultDto, TScopeDto } from '@/services/watchtower/watchtower.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ScopesListProps = {
  scopes: TPaginationResultDto<TScopeDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const ScopesList: React.FunctionComponent<ScopesListProps> = ({
  scopes,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = scopes;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/watchtower/${serviceId}/scope?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/watchtower/${serviceId}/scope?page=1&pageSize=${newPageSize}`);
  };

  const formatScopeType = (scope: TScopeDto): string => {
    if (scope.ipScope) return `IP: ${scope.ipScope.address}`;
    if (scope.asnScope) return `ASN: ${scope.asnScope.asn}${scope.asnScope.asnOrganization ? ` (${scope.asnScope.asnOrganization})` : ''}`;
    if (scope.subnetScope) return `Subnet: ${scope.subnetScope.address}`;
    return scope.scopeType.name || scope.scopeTypeId;
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((scope) => (
              <Link
                key={scope.id}
                href={`/watchtower/${serviceId}/scope/${scope.id}`}
              >
                <ListItem>
                  <strong>{formatScopeType(scope)}</strong> - Type: {scope.scopeType.name} ({scope.scopeType.key}) - Created: {new Date(scope.creationTime).toLocaleString()}
                  {scope.externalId && <span> - Ext-ID: {scope.externalId}</span>}
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
        <p>Keine Scopes gefunden.</p>
      )}
    </div>
  );
};

export default ScopesList;
