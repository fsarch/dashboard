import { DataTableMappingDtoType } from "@/services/datatable/datatable.type";

export type DataTableValue = {
  key: string;
  identifiers: Record<string, any>;
  raw: unknown;
  mappedValue: Record<string, any>;
  rowBased: Array<{
    name: string;
    mapping: DataTableMappingDtoType;
    value: any;
    isUpdated: boolean;
  }>;
  isUpdated: boolean;
};
