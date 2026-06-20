'use client';

import React from 'react';
import { TPaginationResultDto, TClaimDto } from '@/services/bot-protection/bot-protection.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ClaimsListProps = {
  claims: TPaginationResultDto<TClaimDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const ClaimsList: React.FunctionComponent<ClaimsListProps> = ({
  claims,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = claims;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/bot-protection/${serviceId}/claim?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/bot-protection/${serviceId}/claim?page=1&pageSize=${newPageSize}`);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((claim) => (
              <Link
                key={claim.id}
                href={`/bot-protection/${serviceId}/claim/${claim.id}`}
              >
                <ListItem>
                  <strong>ID: {claim.id}</strong>
                  {claim.externalId && <span> - Ext-ID: {claim.externalId}</span>}
                  <br />
                  Difficulty: {claim.difficulty}
                  {claim.duration && <span> - Duration: {claim.duration}s</span>}
                  <br />
                  Created: {formatDate(claim.creationTime)}
                  {claim.deletionTime && <span> - Deleted: {formatDate(claim.deletionTime)}</span>}
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
        <p>Keine Claims gefunden.</p>
      )}
    </div>
  );
};

export default ClaimsList;
