import { fetchService } from "@/utils/fetchService";
import { PrinterDto, PrintJobDto, ReceiptDataDto } from "@/services/printer/printer.type";

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

const createReceiptJob = async (
  printerId: string, 
  data: ReceiptDataDto, 
  options?: { externalId?: string }
): Promise<PrintJobDto> => {
  const createJobResponse = await fetchService(`/v1/printers/${printerId}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
      externalId: options?.externalId || null,
    }),
  });
  const job = await createJobResponse.json();

  return job;
};

export const printerService = {
  listPrinters,
  getPrinter,
  getJobs,
  createReceiptJob,
};