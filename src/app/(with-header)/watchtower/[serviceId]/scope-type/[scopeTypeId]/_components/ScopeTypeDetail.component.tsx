'use client';

import React from 'react';
import { TScopeTypeReadDto } from '@/services/watchtower/watchtower.type';
import styles from './ScopeTypeDetail.module.scss';

type ScopeTypeDetailProps = {
  scopeType: TScopeTypeReadDto;
  serviceId: string;
};

const ScopeTypeDetail: React.FunctionComponent<ScopeTypeDetailProps> = ({ scopeType, serviceId }) => {
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <td><code>{scopeType.id}</code></td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{scopeType.name}</td>
          </tr>
          <tr>
            <th>Key</th>
            <td><code>{scopeType.key}</code></td>
          </tr>
          <tr>
            <th>Score Factor</th>
            <td>{scopeType.scoreFactor}</td>
          </tr>
          <tr>
            <th>Scope Data Type ID</th>
            <td>{scopeType.scopeDataTypeId}</td>
          </tr>
          {scopeType.externalId && (
            <tr>
              <th>Externe ID</th>
              <td><code>{scopeType.externalId}</code></td>
            </tr>
          )}

          {scopeType.ipScopeType && (
            <>
              <tr>
                <th colSpan={2} className={styles.sectionHeader}>IP Scope Type Konfiguration</th>
              </tr>
              <tr>
                <th>Auto ASN Creation</th>
                <td>{scopeType.ipScopeType.enableAutoAsnCreation ? 'Aktiviert' : 'Deaktiviert'}</td>
              </tr>
              {scopeType.ipScopeType.autoAsnScopeTypeId && (
                <tr>
                  <th>Auto ASN Scope Type</th>
                  <td><code>{scopeType.ipScopeType.autoAsnScopeTypeId}</code></td>
                </tr>
              )}
              {scopeType.ipScopeType.autoAsnIpAsnDatasourceId && (
                <tr>
                  <th>Auto ASN Datasource</th>
                  <td><code>{scopeType.ipScopeType.autoAsnIpAsnDatasourceId}</code></td>
                </tr>
              )}
              <tr>
                <th>Auto Subnet Creation</th>
                <td>{scopeType.ipScopeType.enableAutoSubnetCreation ? 'Aktiviert' : 'Deaktiviert'}</td>
              </tr>
              {scopeType.ipScopeType.autoSubnetScopeTypeId && (
                <tr>
                  <th>Auto Subnet Scope Type</th>
                  <td><code>{scopeType.ipScopeType.autoSubnetScopeTypeId}</code></td>
                </tr>
              )}
              {scopeType.ipScopeType.autoSubnetIp4SubnetMask !== null && (
                <tr>
                  <th>IPv4 Subnet Mask</th>
                  <td>{scopeType.ipScopeType.autoSubnetIp4SubnetMask}</td>
                </tr>
              )}
              {scopeType.ipScopeType.autoSubnetIp6SubnetMask !== null && (
                <tr>
                  <th>IPv6 Subnet Mask</th>
                  <td>{scopeType.ipScopeType.autoSubnetIp6SubnetMask}</td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScopeTypeDetail;
