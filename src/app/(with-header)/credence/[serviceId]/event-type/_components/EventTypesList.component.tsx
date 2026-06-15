'use client';

import React from 'react';
import { TPaginationResultDto, TEventTypeDto } from '@/services/credence/credence.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';

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
                </ListItem>
              </Link>
            ))}
          </List>
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={metadata.totalItems}
            basePath={`/credence/${serviceId}/event-type`}
          />
        </>
      ) : (
        <p>Keine Event Types gefunden.</p>
      )}
    </div>
  );
};

export default EventTypesList;
