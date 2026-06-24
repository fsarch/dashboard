'use client';

import React, { useState } from 'react';
import { TServiceConfiguration } from '@/utils/configuration.type';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';
import styles from './MetricServerServiceClient.module.scss';

type MetricServerServiceClientProps = {
  service: TServiceConfiguration;
};

const MetricServerServiceClient: React.FunctionComponent<MetricServerServiceClientProps> = ({ service }) => {
  const [showRaw, setShowRaw] = useState(false);

  const entries = Object.entries(service).filter(([key]) => key !== 'type');

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Typ</th>
            <td><code>{service.type}</code></td>
          </tr>
          <tr>
            <th>ID</th>
            <td><code>{service.id}</code></td>
          </tr>
          {service.name ? (
            <tr>
              <th>Name</th>
              <td>{service.name}</td>
            </tr>
          ) : null}
          {entries
            .filter(([key]) => !['id', 'name'].includes(key))
            .map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td><code>{String(value)}</code></td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className={styles.actions}>
        <Link href={`/metric-server/${service.id}/metric-type`} passHref>
          <Button type="button">
            Metric Types
          </Button>
        </Link>
        <Link href={`/metric-server/${service.id}/metric`} passHref>
          <Button type="button">
            Metrics
          </Button>
        </Link>
        <Button type="button" onClick={() => setShowRaw(!showRaw)}>
          {showRaw ? 'Konfiguration verbergen' : 'Konfiguration anzeigen'}
        </Button>
      </div>

      {showRaw ? (
        <pre className={styles.raw}>
          {JSON.stringify(service, null, 2)}
        </pre>
      ) : null}
    </div>
  );
};

export default MetricServerServiceClient;
