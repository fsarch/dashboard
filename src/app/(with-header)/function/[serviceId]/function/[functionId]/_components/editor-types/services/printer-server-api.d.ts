// service: printer-server
// interface: PrinterServerApi

namespace FsArchApiCatalog {
  type TextFormatDto = {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: number;
  };

  type AlignmentReceiptDataDto = {
    $type: 'alignment';
    value: 'left' | 'center' | 'right';
  };

  type TextReceiptDataDto = {
    $type: 'text';
    value: string;
    format?: TextFormatDto;
  };

  type CutReceiptDataDto = {
    $type: 'cut';
  };

  type NewlineReceiptDataDto = {
    $type: 'newline';
  };

  type ReceiptDataDto = AlignmentReceiptDataDto | TextReceiptDataDto | CutReceiptDataDto | NewlineReceiptDataDto;

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
    createReceiptJob(printerId: string, data: ReceiptDataDto, options?: { externalId?: string }): Promise<PrintJobDto>;
  }

  declare interface PrinterServerApi {
    /**
     * Manage print jobs
     */
    readonly jobs: PrinterJobsApi;
  }
}