import React from 'react';
import { DataTableMappingDtoType } from "@/services/datatable/datatable.type";
import DataTableIntegerCell from "@/components/apps/datatable/datatable/cell/integer/DataTableIntegerCell";

type DataTableCellProps = {
  value: any;
  mapping: DataTableMappingDtoType;
};

const DataTableCell: React.FunctionComponent<DataTableCellProps> = ({
  value,
  mapping,
}) => {
  if (mapping.type === 'integer') {
    return (
      <DataTableIntegerCell
        mapping={mapping}
        value={value}
      />
    )
  }

  return (
    <div>
      {value}
    </div>
  );
};

export default DataTableCell;
