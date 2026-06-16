'use client';

import React from 'react';
import { TAggregationModeTypeDto } from '@/services/credence/credence.type';
import styles from './AggregationModeTypeDetail.module.scss';

type AggregationModeTypeDetailProps = {
  aggregationModeType: TAggregationModeTypeDto;
  serviceId: string;
};

const AggregationModeTypeDetail: React.FunctionComponent<AggregationModeTypeDetailProps> = ({
  aggregationModeType,
  serviceId,
}) => {
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <td><code>{aggregationModeType.id}</code></td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{aggregationModeType.name}</td>
          </tr>
          {aggregationModeType.externalId && (
            <tr>
              <th>External ID</th>
              <td><code>{aggregationModeType.externalId}</code></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AggregationModeTypeDetail;
