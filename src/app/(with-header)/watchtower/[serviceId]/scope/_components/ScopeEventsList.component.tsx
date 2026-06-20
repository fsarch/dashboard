'use client';

import React from 'react';
import { TPaginationResultDto, TEventScopeDto } from '@/services/watchtower/watchtower.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';

type ScopeEventsListProps = {
  events: TPaginationResultDto<TEventScopeDto>;
  serviceId: string;
  scopeId: string;
  page: number;
  pageSize: number;
};

const ScopeEventsList: React.FunctionComponent<ScopeEventsListProps> = ({
  events,
  serviceId,
  scopeId,
  page,
  pageSize,
}) => {
  const { data, metadata } = events;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/watchtower/${serviceId}/scope/${scopeId}?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/watchtower/${serviceId}/scope/${scopeId}?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((eventScope) => (
              <ListItem key={eventScope.id}>
                <strong>{eventScope.eventType.name}</strong> - Score Factor: {eventScope.event.scoreFactor}
                <br />
                Created: {new Date(eventScope.creationTime).toLocaleString()}
                {eventScope.deletionTime && (
                  <span> - Deleted: {new Date(eventScope.deletionTime).toLocaleString()}</span>
                )}
                {eventScope.event.externalId && (
                  <span> - Event Ext-ID: {eventScope.event.externalId}</span>
                )}
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
        <p>Keine Events für diesen Scope gefunden.</p>
      )}
    </div>
  );
};

export default ScopeEventsList;
