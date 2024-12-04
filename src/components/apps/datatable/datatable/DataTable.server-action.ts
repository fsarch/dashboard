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

export async function updateDataTableData({
  dataTableId,
  serviceId,
  update,
}: {
  dataTableId: string;
  serviceId: string;
  update: Array<{
    identifiers: Record<string, unknown>;
    patch: Record<string, unknown>;
  }>;
}) {
  return await dataTableService.updateDataTableData({
    dataTableId,
    serviceId,
    update,
  });
}
