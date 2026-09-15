import React from 'react';
import { TCustomResourceDefinition } from '@/utils/app/custom-resources';
import CustomResourceInstancePicker from './CustomResourceInstancePicker.component';
import styles from './CustomResourceDetail.module.scss';

type CustomResourceDetailProps = {
  resource: TCustomResourceDefinition;
  serviceId: string;
};

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
            </tbody>
          </table>
        </>
      )}

      <CustomResourceInstancePicker serviceId={serviceId} resource={resource} />
    </div>
  );
};

export default CustomResourceDetail;
