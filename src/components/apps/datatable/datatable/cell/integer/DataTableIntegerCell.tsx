import React, { ChangeEvent, ChangeEventHandler, useCallback } from 'react';
import { DataTableIntegerMappingDto } from "@/services/datatable/datatable.type";
import DataTableInputCell from "@/components/apps/datatable/datatable/cell/DataTableInputCell";
import { useDataTableValue } from "@/components/apps/datatable/datatable/hooks/useDataTableValue";

type DataTableIntegerCellProps = {
  value: any;
  mapping: DataTableIntegerMappingDto;
};

const DataTableIntegerCell: React.FunctionComponent<DataTableIntegerCellProps> = ({
  value,
  mapping,
}) => {
  const [displayValue, updateValue] = useDataTableValue(mapping, value);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateValue(parseInt(event.target.value, 10));
  }, [updateValue]);

  return (
    <DataTableInputCell
      value={displayValue ?? ''}
      onChange={handleChange}
      disabled={!mapping.isEditable ? false : undefined}
    />
  );
};

export default DataTableIntegerCell;
