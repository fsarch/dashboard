import clsx from 'clsx';
import type React from 'react';
import DataTableCell from '@/components/apps/datatable/datatable/cell/DataTableCell';
import { RowIdentifierContextProvider } from '@/components/apps/datatable/datatable/constants/RowIdentifierContext';
import type { DataTableValue } from '@/components/apps/datatable/datatable/DataTable.type';
import type { DataTableDto } from '@/services/datatable/datatable.type';
import styles from './DataTableRow.module.scss';

type DataTableRowProps = {
  data: DataTableValue;
  definition: DataTableDto;
};

const DataTableRow: React.FunctionComponent<DataTableRowProps> = ({ data }) => {
  return (
    <RowIdentifierContextProvider
      identifiers={data.identifiers}
      identificationKey={data.key}
    >
      <tr
        className={clsx({
          [styles.rowOverridden]: data.isUpdated,
        })}
      >
        {data.rowBased.map((d) => (
          <td
            className={clsx(styles.cell, d.isUpdated && styles.cellOverridden)}
            key={d.name}
          >
            <DataTableCell value={d.value} mapping={d.mapping} />
          </td>
        ))}
      </tr>
    </RowIdentifierContextProvider>
  );
};

export default DataTableRow;
