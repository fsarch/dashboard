import { DataTableMappingDtoType } from "@/services/datatable/datatable.type";
import { useCallback } from "react";
import { useRowIdentifierContext } from "@/components/apps/datatable/datatable/constants/RowIdentifierContext";
import { useDataTableUpdateContext } from "@/components/apps/datatable/datatable/constants/DataTableUpdateContext";

export function useDataTableValue<T>(mapping: DataTableMappingDtoType, value: T) {
  const { identifiers, identificationKey } = useRowIdentifierContext();
  const updateData = useDataTableUpdateContext();

  const handleUpdate = useCallback((newValue: T) => {
    updateData({
      object: identifiers,
      key: identificationKey,
    }, mapping.selector, newValue);
  }, [identifiers, identificationKey, mapping.selector, updateData]);

  return [value, handleUpdate]
}
