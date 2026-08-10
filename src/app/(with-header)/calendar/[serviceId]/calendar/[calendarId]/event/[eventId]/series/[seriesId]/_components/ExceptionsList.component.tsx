'use client';

import React from 'react';
import { TPaginationResultDto, TEventExceptionDto } from '@/services/calendar/calendar.type';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';

type ExceptionsListProps = {
  exceptions: TPaginationResultDto<TEventExceptionDto>;
  serviceId: string;
  calendarId: string;
  eventId: string;
  seriesId: string;
  page: number;
  pageSize: number;
};

const ExceptionsList: React.FunctionComponent<ExceptionsListProps> = ({
  exceptions,
  serviceId,
  calendarId,
  eventId,
  seriesId,
  page,
  pageSize,
}) => {
  const { data, metadata } = exceptions;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}/series/${seriesId}?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}/series/${seriesId}?page=1&pageSize=${newPageSize}`);
  };

  if (data.length === 0) {
    return <p>Keine Exceptions gefunden.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
        <List>
          {data.map((exception) => (
            <LinkListItem
              key={exception.id}
              href={`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}/series/${seriesId}/exception/${exception.id}`}
            >
              <strong>{new Date(exception.originalStart).toLocaleString()}</strong>
              <br />
              <small>
                {exception.isCancelled ? 'Storniert' : ''}
                {exception.isCancelled && exception.isMoved ? ' | ' : ''}
                {exception.isMoved ? 'Verschoben' : ''}
                {!exception.isCancelled && !exception.isMoved ? 'Keine Änderung' : ''}
              </small>
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

export default ExceptionsList;
