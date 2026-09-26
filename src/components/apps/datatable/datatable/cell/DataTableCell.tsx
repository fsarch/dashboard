import type React from 'react';
import DataTableIntegerCell from '@/components/apps/datatable/datatable/cell/integer/DataTableIntegerCell';
import type { DataTableMappingDtoType } from '@/services/datatable/datatable.type';

type DataTableCellProps = {
  value: any;
  mapping: DataTableMappingDtoType;
};

const DataTableCell: React.FunctionComponent<DataTableCellProps> = ({
  value,
  mapping,
}) => {
  if (mapping.type === 'integer') {
    return <DataTableIntegerCell mapping={mapping} value={value} />;
  }

  return <div>{value}</div>;
};

export default DataTableCell;
