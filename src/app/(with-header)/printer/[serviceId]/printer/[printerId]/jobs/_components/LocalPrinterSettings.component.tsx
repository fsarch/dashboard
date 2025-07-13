'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import Button from "@/components/universals/forms/Button";
import {
  LocalPrinterProvider, TLocalPrinterContext
} from "@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinter.context";
import type WebUSBReceiptPrinterType from '@point-of-sale/webusb-receipt-printer';

type LocalPrinterSettingsProps = PropsWithChildren<{

}>;

const LocalPrinterSettings: React.FunctionComponent<LocalPrinterSettingsProps> = ({
  children,
}) => {
  const [printer, setPrinter] = React.useState<TLocalPrinterContext | null>(null);

  const handleConnectClick = useCallback(async () => {
    // @ts-ignore
    const WebUSBReceiptPrinter = (await import('/node_modules/@point-of-sale/webusb-receipt-printer/dist/webusb-receipt-printer.esm')).default;

    const receiptPrinter: WebUSBReceiptPrinterType = new WebUSBReceiptPrinter();

    const res = await new Promise<TLocalPrinterContext>((resolve) => {
      receiptPrinter.addEventListener('connected', (device) => {
        console.log(`Connected to ${device.manufacturerName} ${device.productName} (#${device.serialNumber})`);

        const printerLanguage = device.language;
        const printerCodepageMapping = device.codepageMapping;

        /* Store device for reconnecting */
        const lastUsedDevice = device;

        console.log('printerLanguage', printerLanguage);

        resolve({
          printer: receiptPrinter,
          device,
        });
      });

      receiptPrinter.connect();
    });

    setPrinter(res);
  }, [setPrinter]);

  return (
    <>
      <Section name="Lokale Druckereinstellungen">
        <Button
          type="button"
          onClick={handleConnectClick}
        >
          Drucker verbinden
        </Button>
      </Section>
      <LocalPrinterProvider value={printer}>
        {children}
      </LocalPrinterProvider>
    </>
  );
};

export default LocalPrinterSettings;
