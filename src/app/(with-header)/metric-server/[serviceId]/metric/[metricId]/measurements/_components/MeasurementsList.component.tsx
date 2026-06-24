'use client';

import React from 'react';
import { TPaginationResultDto, TMeasurementDto } from '@/services/metric-server/metric-server.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { useRouter } from 'next/navigation';
import MeasurementsChart from './MeasurementsChart.component';

type MeasurementsListProps = {
  measurements: TPaginationResultDto<TMeasurementDto>;
  serviceId: string;
  metricId: string;
  limit: number;
  offset: number;
};

const MeasurementsList: React.FunctionComponent<MeasurementsListProps> = ({
  measurements,
  serviceId,
  metricId,
  limit,
  offset,
}) => {
  const { data, metadata } = measurements;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * limit;
    router.push(`/metric-server/${serviceId}/metric/${metricId}/measurements?limit=${limit}&offset=${newOffset}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/metric-server/${serviceId}/metric/${metricId}/measurements?limit=${newPageSize}&offset=0`);
  };

  const formatMeta = (meta: object | null): string => {
    if (!meta) return 'N/A';
    return Object.entries(meta).map(([key, value]) => `${key}: ${value}`).join(', ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {data.length > 0 ? (
        <>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Messwerte über die Zeit</h4>
            <MeasurementsChart data={data} />
          </div>

          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
            <List>
              {data.map((measurement, index) => (
                <ListItem key={`${measurement.metricId}-${index}`}>
                  <strong>Value: {measurement.value}</strong>
                  <br />
                  <small>
                    Log Time: {new Date(measurement.logTime).toLocaleString()} | 
                    Warm Tier: {measurement.isWarmTier ? 'Yes' : 'No'} | 
                    Meta: {formatMeta(measurement.meta)}
                  </small>
                </ListItem>
              ))}
            </List>
          </div>

          <Pagination
            currentPage={Math.floor(offset / limit) + 1}
            pageSize={limit}
            totalItems={metadata.totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            hasNextPage={offset + limit < metadata.totalItems}
          />
        </>
      ) : (
        <p>Keine Measurements gefunden für diese Metric.</p>
      )}
    </div>
  );
};

export default MeasurementsList;
