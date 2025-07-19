'use server';

import { printerService } from "@/services/printer/printer.service";

export async function updateCollectionTime(
  printerId: string,
  jobId: string,
) {
  return await printerService.updatePrintJob(printerId, jobId, {
    collectionTime: new Date().toISOString(),
  });
}

export async function updatePrintTime(
  printerId: string,
  jobId: string,
) {
  return await printerService.updatePrintJob(printerId, jobId, {
    printTime: new Date().toISOString(),
  });
}
