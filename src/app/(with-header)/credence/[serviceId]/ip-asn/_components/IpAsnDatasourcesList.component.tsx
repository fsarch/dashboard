'use client';

import React from 'react';
import { TPaginationResultDto, TIpAsnDatasourceDto } from '@/services/credence/credence.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type IpAsnDatasourcesListProps = {
  datasources: TPaginationResultDto<TIpAsnDatasourceDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const IpAsnDatasourcesList: React.FunctionComponent<IpAsnDatasourcesListProps> = ({
  datasources,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = datasources;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/credence/${serviceId}/ip-asn?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/credence/${serviceId}/ip-asn?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((datasource) => (
              <Link
                key={datasource.id}
                href={`/credence/${serviceId}/ip-asn/${datasource.id}`}
              >
                <ListItem>
                  <strong>{datasource.name}</strong> {datasource.externalId ? `(${datasource.externalId})` : null}
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
        <p>Keine IP-ASN Datenquellen gefunden.</p>
      )}
    </div>
  );
};

export default IpAsnDatasourcesList;
