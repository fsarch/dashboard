import { fetchService } from "@/utils/fetchService";
import { PrinterDto } from "@/services/printer/printer.type";

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

export const printerService = {
  listPrinters,
  getPrinter,
};