export type PrinterDto = {
  id: string;
  printerTypeId: string;
  name: string;
  externalId: string | null;
  creationTime: Date;
};

export type AlignmentReceiptDataDto = {
  $type: 'alignment';
  alignment: 'left' | 'center' | 'right';
  children: ReceiptDataDto[];
};

export type TextFormatDto = {
  font?: 'a' | 'b' | 'c';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean | 2;
};

export type TextReceiptDataDto = {
  $type: 'text';
  value: string;
  format?: TextFormatDto;
};

export type CutReceiptDataDto = {
  $type: 'cut';
};

export type NewlineReceiptDataDto = {
  $type: 'newline';
};

export type QrReceiptDataDto = {
  $type: 'qr-code';
  value: string;
};

export type ReceiptDataDto =
  | AlignmentReceiptDataDto
  | TextReceiptDataDto
  | CutReceiptDataDto
  | NewlineReceiptDataDto
  | QrReceiptDataDto;

export type PrintJobDto = {
  id: string;
  printerId: string;
  printJobTypeId: string;
  externalId: string | null;
  collectionPrinterCredentialId: string | null;
  collectionTime: string | null;
  printTime: string | null;
  creationTime: Date;
  receiptData?: any;
  data?: Array<ReceiptDataDto>;
};
