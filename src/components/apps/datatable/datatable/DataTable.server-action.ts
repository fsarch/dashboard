'use server';

import { dataTableService } from "@/services/datatable/datatable.service";

export async function loadDataTableData({
  dataTableId,
  serviceId,
}: {
  dataTableId: string;
  serviceId: string;
}) {
  return await dataTableService.listDataTableData({
    dataTableId,
    serviceId,
  });
}
