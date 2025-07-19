// service: printer-server
// interface: PrinterServerApi

namespace FsArchApiCatalog {
  type TextFormatDto = {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    size?: number;
  };

  type LineFormatDto = {
    font?: 'a' | 'b' | 'c';
  };

  type AlignmentReceiptDataDto = {
    $type: 'alignment';
    value: 'left' | 'center' | 'right';
    children: Array<SimpleReceiptDataDto>;
  };

  type TextReceiptDataDto = {
    $type: 'text';
    value: string;
    format?: TextFormatDto;
  };

  type LineReceiptDataDto = {
    $type: 'line';
    children: Array<SimpleReceiptDataDto>;
    format?: LineFormatDto;
  };

  type CutReceiptDataDto = {
    $type: 'cut';
  };

  type NewlineReceiptDataDto = {
    $type: 'newline';
  };

  type QrReceiptDataDto = {
    $type: 'qr-code';
    value: string;
  };

  type SimpleReceiptDataDto = TextReceiptDataDto | CutReceiptDataDto | NewlineReceiptDataDto | QrReceiptDataDto;
  type ReceiptDataDto = AlignmentReceiptDataDto | SimpleReceiptDataDto | LineReceiptDataDto;

  type PrintJobDto = {
    id: string;
    printerId: string;
    status: 'pending' | 'printing' | 'completed' | 'failed';
    data: ReceiptDataDto;
    externalId?: string;
    createdAt: string;
    updatedAt: string;
  };

  interface PrinterJobsApi {
    /**
     * Create a new receipt print job for the specified printer
     * @param printerId The ID of the printer to send the job to
     * @param data The receipt data to print
     * @param options Optional parameters including external ID for tracking
     */
    createReceiptJob(printerId: string, data: Array<ReceiptDataDto>, options?: { externalId?: string }): Promise<PrintJobDto>;
  }

  interface PrinterPrintersApi {
    /**
     * Manage print jobs of a specific printer
     */
    readonly jobs: PrinterJobsApi;
  }

  declare interface PrinterServerApi {
    /**
     * Manage printers
     */
    readonly printers: PrinterPrintersApi;
  }
}
