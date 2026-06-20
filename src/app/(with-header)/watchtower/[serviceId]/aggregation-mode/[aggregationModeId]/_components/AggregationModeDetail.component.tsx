'use client';

import React from 'react';
import { TAggregationModeReadDto } from '@/services/watchtower/watchtower.type';
import styles from './AggregationModeDetail.module.scss';

type AggregationModeDetailProps = {
  aggregationMode: TAggregationModeReadDto;
  serviceId: string;
};

const AggregationModeDetail: React.FunctionComponent<AggregationModeDetailProps> = ({
  aggregationMode,
  serviceId,
}) => {
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <td><code>{aggregationMode.id}</code></td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{aggregationMode.name}</td>
          </tr>
          <tr>
            <th>Aggregation Mode Type</th>
            <td>{aggregationMode.aggregationModeType.name}</td>
          </tr>
          <tr>
            <th>Aggregation Mode Type ID</th>
            <td><code>{aggregationMode.aggregationModeTypeId}</code></td>
          </tr>
          {aggregationMode.maxFactor && (
            <tr>
              <th>Max Factor</th>
              <td>{aggregationMode.maxFactor}</td>
            </tr>
          )}
          {aggregationMode.externalId && (
            <tr>
              <th>External ID</th>
              <td><code>{aggregationMode.externalId}</code></td>
            </tr>
          )}
          <tr>
            <th>Creation Time</th>
            <td>{aggregationMode.creationTime}</td>
          </tr>
          {aggregationMode.deletionTime && (
            <tr>
              <th>Deletion Time</th>
              <td>{aggregationMode.deletionTime}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AggregationModeDetail;
