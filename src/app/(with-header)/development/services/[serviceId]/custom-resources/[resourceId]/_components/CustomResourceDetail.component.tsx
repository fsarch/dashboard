import React from 'react';
import { TCustomResourceDefinition } from '@/utils/app/custom-resources';
import CustomResourceInstancePicker from './CustomResourceInstancePicker.component';
import styles from './CustomResourceDetail.module.scss';

type CustomResourceDetailProps = {
  resource: TCustomResourceDefinition;
  serviceId: string;
};

// Stellt konfigurierte queryParams (Record<string, string | string[]>) als
// einzeiligen "key=val & key2=val2" Text dar - reine Anzeige.
const formatQueryParams = (queryParams: Record<string, string | string[]>): string => Object.entries(queryParams)
  .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
  .join(' & ');

const CustomResourceDetail: React.FunctionComponent<CustomResourceDetailProps> = ({ resource, serviceId }) => {
  const { list, get } = resource.apiRoutes;

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>ID</th>
            <td><code>{resource.id}</code></td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{resource.name}</td>
          </tr>
          <tr>
            <th>Beschreibung</th>
            <td>{resource.description}</td>
          </tr>
        </tbody>
      </table>

      {list && (
        <>
          <h3>List-Route</h3>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>Pfad</th>
                <td><code>{list.request.path}</code></td>
              </tr>
              <tr>
                <th>Methode</th>
                <td><code>{list.request.method}</code></td>
              </tr>
              <tr>
                <th>Auth</th>
                <td><code>{list.request.auth.type}</code></td>
              </tr>
              {list.request.queryParams && (
                <tr>
                  <th>Query-Parameter</th>
                  <td><code>{formatQueryParams(list.request.queryParams)}</code></td>
                </tr>
              )}
              <tr>
                <th>Pagination</th>
                <td>{list.enablePagination ? 'Ja' : 'Nein'}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {get && (
        <>
          <h3>Get-Route</h3>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>Pfad</th>
                <td><code>{get.request.path}</code></td>
              </tr>
              <tr>
                <th>Methode</th>
                <td><code>{get.request.method}</code></td>
              </tr>
              <tr>
                <th>Auth</th>
                <td><code>{get.request.auth.type}</code></td>
              </tr>
              {get.request.queryParams && (
                <tr>
                  <th>Query-Parameter</th>
                  <td><code>{formatQueryParams(get.request.queryParams)}</code></td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      <CustomResourceInstancePicker serviceId={serviceId} resource={resource} />
    </div>
  );
};

export default CustomResourceDetail;
