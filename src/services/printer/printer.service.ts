import { fetchService } from "@/utils/fetchService";
import { PrinterDto, CreatePrinterDto } from "@/services/printer/printer.type";

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

const createPrinter = async (createPrinterDto: CreatePrinterDto): Promise<PrinterDto> => {
  const printerResponse = await fetchService('/v1/printers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPrinterDto),
  });
  const printer = await printerResponse.json();

  return printer;
};

export const printerService = {
  listPrinters,
  getPrinter,
  createPrinter,
};