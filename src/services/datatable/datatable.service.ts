import { fetchService } from "@/utils/fetchService";
import { DataTableDto } from "@/services/datatable/datatable.type";

const listDataTables = async (): Promise<Array<DataTableDto>> => {
  const dataTableResponse = await fetchService('/v1/datatables');
  const dataTables = await dataTableResponse.json();

  return dataTables;
};

const getDataTable = async (dataTableId: string): Promise<DataTableDto | undefined> => {
  const dataTables = await listDataTables();

  return dataTables.find(dt => dt.id === dataTableId);
};

const listDataTableData = async (options: { serviceId: string; dataTableId: string; }): Promise<Array<unknown>> => {
  const dataTableDataResponse = await fetchService(`/v1/datatables/${options.dataTableId}/data`, {

  }, {
    serviceId: options.serviceId,
  });
  const dataTablesData = await dataTableDataResponse.json();

  return dataTablesData;
}

export const dataTableService = {
  listDataTables,
  getDataTable,
  listDataTableData,
};
