export type PrinterDto = {
  id: string;
  printerTypeId: string;
  name: string;
  externalId: string | null;
  creationTime: Date;
};

export type CreatePrinterDto = {
  printerTypeId: string;
  name: string;
  externalId?: string;
};