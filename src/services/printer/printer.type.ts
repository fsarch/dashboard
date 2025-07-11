export type PrinterDto = {
  id: string;
  printerTypeId: string;
  name: string;
  externalId: string | null;
  creationTime: Date;
};

export interface PrintJobDto {
  id: string;
  printerId: string;
  printJobTypeId: string;
  externalId: string | null;
  collectionPrinterCredentialId: string | null;
  collectionTime: string | null;
  printTime: string | null;
  creationTime: Date;
  receiptData?: any;
}