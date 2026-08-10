'use client';

import React from 'react';
import { TPaginationResultDto, TEventSeriesDto } from '@/services/calendar/calendar.type';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';

type SeriesListProps = {
  series: TPaginationResultDto<TEventSeriesDto>;
  serviceId: string;
  calendarId: string;
  eventId: string;
  page: number;
  pageSize: number;
};

const SeriesList: React.FunctionComponent<SeriesListProps> = ({
  series,
  serviceId,
  calendarId,
  eventId,
  page,
  pageSize,
}) => {
  const { data, metadata } = series;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}?page=${newPage}&pageSize=${pageSize}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}?page=1&pageSize=${newPageSize}`);
  };

  if (data.length === 0) {
    return <p>Keine Serien gefunden.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
        <List>
          {data.map((item) => (
            <LinkListItem
              key={item.id}
              href={`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}/series/${item.id}`}
            >
              <strong>{item.rrule}</strong>
              <br />
              <small>
                Zeitzone: {item.timezone} |
                {' '}Gültig ab: {new Date(item.validFrom).toLocaleString()}
                {item.validTo ? ` bis ${new Date(item.validTo).toLocaleString()}` : ''}
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

export default SeriesList;
