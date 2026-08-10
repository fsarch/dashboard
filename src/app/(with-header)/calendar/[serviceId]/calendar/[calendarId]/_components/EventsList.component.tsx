'use client';

import React from 'react';
import { TPaginationResultDto, TEventDto } from '@/services/calendar/calendar.type';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';

type EventsListProps = {
  events: TPaginationResultDto<TEventDto>;
  serviceId: string;
  calendarId: string;
  page: number;
  pageSize: number;
};

const EventsList: React.FunctionComponent<EventsListProps> = ({
  events,
  serviceId,
  calendarId,
  page,
  pageSize,
}) => {
  const { data, metadata } = events;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/calendar/${serviceId}/calendar/${calendarId}?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/calendar/${serviceId}/calendar/${calendarId}?page=1&pageSize=${newPageSize}`);
  };

  if (data.length === 0) {
    return <p>Keine Events gefunden.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
        <List>
          {data.map((event) => (
            <LinkListItem
              key={event.id}
              href={`/calendar/${serviceId}/calendar/${calendarId}/event/${event.id}`}
            >
              <strong>{event.title || '(ohne Titel)'}</strong>
              <br />
              <small>
                {new Date(event.startAt).toLocaleString()}
                {event.endAt ? ` – ${new Date(event.endAt).toLocaleString()}` : ''}
                {event.timezone ? ` (${event.timezone})` : ''}
              </small>
              {event.description ? (
                <>
                  <br />
                  <small>{event.description}</small>
                </>
              ) : null}
            </LinkListItem>
          ))}
        </List>
      </div>
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={metadata.totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={page < metadata.totalPages}
      />
    </div>
  );
};

export default EventsList;