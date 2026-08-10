'use client';

import React from 'react';
import { TPaginationResultDto, TCalendarDto } from '@/services/calendar/calendar.type';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';

type CalendarsListProps = {
  calendars: TPaginationResultDto<TCalendarDto>;
  serviceId: string;
  page: number;
  pageSize: number;
};

const CalendarsList: React.FunctionComponent<CalendarsListProps> = ({
  calendars,
  serviceId,
  page,
  pageSize,
}) => {
  const { data, metadata } = calendars;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/calendar/${serviceId}?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/calendar/${serviceId}?page=1&pageSize=${newPageSize}`);
  };

  if (data.length === 0) {
    return <p>Keine Kalender gefunden.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
        <List>
          {data.map((calendar) => (
            <LinkListItem
              key={calendar.id}
              href={`/calendar/${serviceId}/calendar/${calendar.id}`}
            >
              <strong>{calendar.name}</strong>
              <br />
              <small>
                Zeitzone: {calendar.defaultTimezone} |
                {' '}Ext-ID: {calendar.externalId || 'N/A'} |
                {' '}Erstellt: {new Date(calendar.creationTime).toLocaleString()}
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

export default CalendarsList;