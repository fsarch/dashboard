'use client';

import React from 'react';
import { TPaginationResultDto, TIpAsnDatasourceDto } from '@/services/credence/credence.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';

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
            basePath={`/credence/${serviceId}/ip-asn`}
          />
        </>
      ) : (
        <p>Keine IP-ASN Datenquellen gefunden.</p>
      )}
    </div>
  );
};

export default IpAsnDatasourcesList;
