'use client';

import React from 'react';
import { TPaginationResultDto, TEventTypeDto } from '@/services/credence/credence.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type EventTypesListProps = {
  eventTypes: TPaginationResultDto<TEventTypeDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const EventTypesList: React.FunctionComponent<EventTypesListProps> = ({
  eventTypes,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = eventTypes;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/credence/${serviceId}/event-type?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/credence/${serviceId}/event-type?page=1&pageSize=${newPageSize}`);
  };

  return (
    <div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((eventType) => (
              <Link
                key={eventType.id}
                href={`/credence/${serviceId}/event-type/${eventType.id}`}
              >
                <ListItem>
                  <strong>{eventType.name}</strong> - Score Factor: {eventType.defaultScoreFactor}, TTL: {eventType.defaultTtlSeconds}s
                  {eventType.aggregationModeId && (
                    <> - Aggregation Mode: <code>{eventType.aggregationModeId}</code></>
                  )}
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
        <p>Keine Event Types gefunden.</p>
      )}
    </div>
  );
};

export default EventTypesList;
