import ReceiptPrinterEncoder, { PrinterLanguage } from '@point-of-sale/receipt-printer-encoder';
import { PrintJobDto, ReceiptDataDto } from "@/services/printer/printer.type";
import { TLocalPrinterContext } from "./LocalPrinter.context";
import {
  updateCollectionTime, updatePrintTime
} from "./LocalPrinterPrintIcon.server-action";

const DEFAULT_FONT = 'a';

function encodeReceiptTextData(
  item: ReceiptDataDto & { $type: 'text' },
  encoder: ReceiptPrinterEncoder,
) {
  // SET format styles
  if (item.format?.size) {
    encoder.size(item.format.size);
  }

  if (item.format?.bold) {
    encoder.bold(item.format.bold);
  }

  if (item.format?.italic) {
    encoder.italic(item.format.italic);
  }

  if (item.format?.underline) {
    encoder.underline(item.format.underline);
  }

  // WRITE TEXT
  encoder.text(item.value);

  // RESET format styles
  if (item.format?.underline) {
    encoder.underline(false);
  }

  if (item.format?.italic) {
    encoder.italic(false);
  }

  if (item.format?.bold) {
    encoder.bold(false);
  }

  if (item.format?.size) {
    encoder.size(1);
  }
}

function encodeReceiptLineData(
  item: ReceiptDataDto & { $type: 'line' },
  encoder: ReceiptPrinterEncoder,
) {
  // SET format styles
  if (item.format?.font) {
    encoder.font(item.format.font);
  }

  encodeReceiptData(item.children, encoder);

  encoder.newline();

  if (item.format?.font) {
    encoder.font(DEFAULT_FONT);
  }
}

function encodeReceiptData(data: Array<ReceiptDataDto>, encoder: ReceiptPrinterEncoder) {
  data.forEach((item) => {
    switch (item.$type) {
      case 'alignment':
        encoder.align(item.alignment);
        item.children.forEach((child) => {
          encodeReceiptData([child], encoder);
        });
        encoder.newline(); // Add a newline after processing children
        encoder.align('left'); // Reset alignment to left after processing children
        break;
      case 'text':
        encodeReceiptTextData(item, encoder);
        break;
      case 'line':
        encodeReceiptLineData(item, encoder);
        break;
      case 'cut':
        encoder.cut();
        break;
      case 'newline':
        encoder.newline();
        break;
      case 'qr-code':
        encoder.qrcode(item.value);
        break;
      default:
        console.warn(`Unknown receipt data type`, {
          item,
        });
    }
  });
}

/**
 * Executes the complete print workflow for a job:
 * 1. Updates collection time (marks as "received")
 * 2. Encodes and prints the job data
 * 3. Updates print time (marks as "printed")
 */
export async function executeAutoPrintJob(
  localPrinter: TLocalPrinterContext,
  job: PrintJobDto
): Promise<void> {
  if (!localPrinter.printer || !localPrinter.device) {
    throw new Error('No printer connected');
  }

  if (!job?.data) {
    throw new Error('No data to print');
  }

  try {
    // Step 1: Mark as received
    await updateCollectionTime(job.printerId, job.id);

    // Step 2: Encode and print
    const { device, printer } = localPrinter;

    let encoder = new ReceiptPrinterEncoder({
      language: device.language as PrinterLanguage | undefined,
      codepageCandidates: [device.codepageMapping, 'epson'],
    }).initialize();

    encodeReceiptData(job.data, encoder);

    const data = encoder.encode();

    await printer.print(data as any);

    // Step 3: Mark as printed
    await updatePrintTime(job.printerId, job.id);

    console.log(`Auto-printed job ${job.id}`);
  } catch (error) {
    console.error(`Failed to auto-print job ${job.id}:`, error);
    throw error;
  }
}