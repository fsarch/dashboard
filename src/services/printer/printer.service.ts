import { fetchService } from "@/utils/fetchService";
import { PrinterDto, PrintJobDto } from "@/services/printer/printer.type";

const listPrinters = async (): Promise<Array<PrinterDto>> => {
  const printersResponse = await fetchService('/v1/printers');
  const printers = await printersResponse.json();

  return printers;
};

const getPrinter = async (printerId: string): Promise<PrinterDto> => {
  const printerResponse = await fetchService(`/v1/printers/${printerId}`);
  const printer = await printerResponse.json();

  return printer;
};

const getJobs = async (printerId: string): Promise<Array<PrintJobDto>> => {
  const jobsResponse = await fetchService(`/v1/printers/${printerId}/jobs`);
  const jobs = await jobsResponse.json();

  return jobs;
};

const getNonPrinterJobs = async (printerId: string): Promise<Array<PrintJobDto>> => {
  const jobsResponse = await fetchService(`/v1/printers/${printerId}/jobs?printTime=null`);
  const jobs = await jobsResponse.json();

  return jobs;
};

const updatePrintJob = async (
  printerId: string,
  jobId: string,
  patchDto: {
    collectionTime?: string | null;
    printTime?: string | null;
  }
): Promise<void> => {
  const jobsResponse = await fetchService(`/v1/printers/${printerId}/jobs/${jobId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchDto),
  });

  if (!jobsResponse.ok) {
    throw new Error(`Failed to update print job: ${jobsResponse.statusText}`);
  }
};

export const printerService = {
  listPrinters,
  getPrinter,
  getJobs,
  updatePrintJob,
  getNonPrinterJobs,
};
