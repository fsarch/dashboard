'use client';

import React, { useCallback } from 'react';
import IconActionButton from "@/components/universals/forms/button/IconActionButton";
import {
  useLocalPrinter
} from "@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinter.context";
import ReceiptPrinterEncoder, { PrinterLanguage } from '@point-of-sale/receipt-printer-encoder';
import { PrintJobDto, ReceiptDataDto } from "@/services/printer/printer.type";
import {
  updateCollectionTime, updatePrintTime
} from "@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinterPrintIcon.server-action";

type LocalPrinterPrintIconProps = {
  job: PrintJobDto;
};

const DEFAULT_FONT = 'a';

function encodeReceiptTextData(
  item: ReceiptDataDto & { $type: 'text' },
  encoder: ReceiptPrinterEncoder,
) {
  // SET format styles
  if (item.format?.font) {
    encoder.font(item.format.font)
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

const LocalPrinterPrintIcon: React.FunctionComponent<LocalPrinterPrintIconProps> = ({
  job,
}) => {
  const localPrinter = useLocalPrinter();

  const handlePrintClick = useCallback(async () => {
    if (!localPrinter || !localPrinter.printer || !localPrinter.device) {
      return;
    }

    if (!job?.data) {
      console.error('No data to print');
      return;
    }

    await updateCollectionTime(job.printerId, job.id);

    const { device, printer } = localPrinter;

    console.log('printer.language', printer, device);

    let encoder = new ReceiptPrinterEncoder({
      language: device.language as PrinterLanguage | undefined,
      // codepageMapping: 'epson' ?? device.codepageMapping,
      codepageCandidates: [device.codepageMapping, 'epson'],
    }).initialize();

    encodeReceiptData(job.data, encoder);

    const data = encoder.encode();

    await printer.print(data as any);

    await updatePrintTime(job.printerId, job.id);
  }, [localPrinter, job]);

  if (!localPrinter) {
    return null;
  }

  return (
    <IconActionButton
      icon="print"
      type="button"
      onClick={handlePrintClick}
    >

    </IconActionButton>
  );
};

export default LocalPrinterPrintIcon;
