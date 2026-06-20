'use client';

import React from 'react';
import { TScopeDto } from '@/services/credence/credence.type';

type ScopeDetailProps = {
  scope: TScopeDto;
  serviceId: string;
};

const ScopeDetail: React.FunctionComponent<ScopeDetailProps> = ({ scope, serviceId }) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{scope.id}</td>
          </tr>
          <tr>
            <th>Scope Type ID</th>
            <td>{scope.scopeTypeId}</td>
          </tr>
          <tr>
            <th>Scope Type Name</th>
            <td>{scope.scopeType.name}</td>
          </tr>
          <tr>
            <th>Scope Type Key</th>
            <td>{scope.scopeType.key}</td>
          </tr>
          <tr>
            <th>Score Factor</th>
            <td>{scope.scopeType.scoreFactor}</td>
          </tr>
          <tr>
            <th>Creation Time</th>
            <td>{new Date(scope.creationTime).toLocaleString()}</td>
          </tr>
          {scope.externalId && (
            <tr>
              <th>External ID</th>
              <td>{scope.externalId}</td>
            </tr>
          )}
          {scope.ipScope && (
            <>
              <tr>
                <th>IP Address</th>
                <td>{scope.ipScope.address}</td>
              </tr>
            </>
          )}
          {scope.asnScope && (
            <>
              <tr>
                <th>ASN</th>
                <td>{scope.asnScope.asn}</td>
              </tr>
              {scope.asnScope.asnOrganization && (
                <tr>
                  <th>ASN Organization</th>
                  <td>{scope.asnScope.asnOrganization}</td>
                </tr>
              )}
            </>
          )}
          {scope.subnetScope && (
            <tr>
              <th>Subnet Address</th>
              <td>{scope.subnetScope.address}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScopeDetail;
