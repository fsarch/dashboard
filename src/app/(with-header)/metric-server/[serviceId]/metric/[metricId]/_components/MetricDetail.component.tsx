'use client';

import React from 'react';
import { TMetricDto } from '@/services/metric-server/metric-server.type';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';

type MetricDetailProps = {
  metric: TMetricDto;
  serviceId: string;
};

const MetricDetail: React.FunctionComponent<MetricDetailProps> = ({ metric, serviceId }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              <code>{metric.id}</code>
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Name
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {metric.name}
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Metric Type ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              <code>{metric.metricTypeId}</code>
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              External ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {metric.externalId || 'N/A'}
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Creation Time
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {new Date(metric.creationTime).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link href={`/metric-server/${serviceId}/metric/${metric.id}/measurements`} passHref>
          <Button type="button">
            Measurements
          </Button>
        </Link>
        <Link href={`/metric-server/${serviceId}/metric/${metric.id}/aggregate`} passHref>
          <Button type="button">
            Aggregate
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MetricDetail;
