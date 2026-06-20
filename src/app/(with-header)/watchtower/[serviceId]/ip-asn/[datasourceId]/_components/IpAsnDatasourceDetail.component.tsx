'use client';

import React from 'react';
import { TIpAsnDatasourceDto, TPaginationResultDto, TIpAsnDataDto } from '@/services/watchtower/watchtower.type';
import styles from './IpAsnDatasourceDetail.module.scss';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';

type IpAsnDatasourceDetailProps = {
  datasource: TIpAsnDatasourceDto;
  ipAsnData: TPaginationResultDto<TIpAsnDataDto>;
  serviceId: string;
  datasourceId: string;
  page: number;
  pageSize: number;
};

const IpAsnDatasourceDetail: React.FunctionComponent<IpAsnDatasourceDetailProps> = ({
  datasource,
  ipAsnData,
  serviceId,
  datasourceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = ipAsnData;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/watchtower/${serviceId}/ip-asn/${datasourceId}?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/watchtower/${serviceId}/ip-asn/${datasourceId}?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div className={styles.root}>
      <div className={styles.datasourceInfo}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>ID</th>
              <td><code>{datasource.id}</code></td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{datasource.name}</td>
            </tr>
            {datasource.externalId && (
              <tr>
                <th>Externe ID</th>
                <td><code>{datasource.externalId}</code></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.dataSection}>
        <h3>IP-ASN Daten</h3>
        {data.length > 0 ? (
          <>
            <List>
              {data.map((item) => (
                <ListItem key={item.id}>
                  <div className={styles.dataItem}>
                    <div><strong>Prefix:</strong> <code>{item.prefix}</code></div>
                    <div><strong>ASN:</strong> {item.asn}</div>
                    <div><strong>Organisation:</strong> {item.asnOrganization}</div>
                    {item.externalId && (
                      <div><strong>Externe ID:</strong> <code>{item.externalId}</code></div>
                    )}
                  </div>
                </ListItem>
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
          <p>Keine IP-ASN Daten gefunden.</p>
        )}
      </div>
    </div>
  );
};

export default IpAsnDatasourceDetail;
