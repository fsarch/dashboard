'use client';

import React from 'react';
import { TEventTypeDto } from '@/services/watchtower/watchtower.type';
import styles from './EventTypeDetail.module.scss';

type EventTypeDetailProps = {
  eventType: TEventTypeDto;
  serviceId: string;
};

const EventTypeDetail: React.FunctionComponent<EventTypeDetailProps> = ({ eventType, serviceId }) => {
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <td><code>{eventType.id}</code></td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{eventType.name}</td>
          </tr>
          <tr>
            <th>Default Score Factor</th>
            <td>{eventType.defaultScoreFactor}</td>
          </tr>
          <tr>
            <th>Default TTL (Seconds)</th>
            <td>{eventType.defaultTtlSeconds}</td>
          </tr>
          {eventType.aggregationModeId && (
            <tr>
              <th>Aggregation Mode ID</th>
              <td><code>{eventType.aggregationModeId}</code></td>
            </tr>
          )}
        </tbody>
      </table>
      <p className={styles.hint}>
        Events mit diesem Typ werden mit dem Score Factor <code>{eventType.defaultScoreFactor}</code>
        bewertet und bleiben für <code>{eventType.defaultTtlSeconds}</code> Sekunden aktiv.
        {eventType.aggregationModeId && (
          <>
            {' Die Ereignisse werden mit Aggregation Mode <code>{eventType.aggregationModeId}</code> aggregiert.'}
          </>
        )}
      </p>
    </div>
  );
};

export default EventTypeDetail;
