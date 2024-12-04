import React from 'react';
import { DataTableDto } from "@/services/datatable/datatable.type";
import styles from './DataTableHeader.module.scss';

type DataTableHeaderProps = {
  definition: DataTableDto;
};

const DataTableHeader: React.FunctionComponent<DataTableHeaderProps> = ({
  definition,
}) => {
  return (
    <tr>
      {definition.mapping.map((mapping) => (
        <th
          className={styles.cell}
          key={mapping.name}
        >
          {mapping.name}
        </th>
      ))}
    </tr>
  );
};

export default DataTableHeader;
