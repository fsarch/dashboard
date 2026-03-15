'use client';

import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import Section from "@/components/universals/section/Section";
import Button from "@/components/universals/forms/Button";
import {
  LocalPrinterProvider, TLocalPrinterContext
} from "@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinter.context";
import type WebUSBReceiptPrinterType from '@point-of-sale/webusb-receipt-printer';
import WebUSBReceiptPrinter from '@point-of-sale/webusb-receipt-printer';
import { useRouter } from "next/navigation";
import WebBluetoothReceiptPrinter from "@point-of-sale/webbluetooth-receipt-printer";
import type WebBluetoothReceiptPrinterType from "@point-of-sale/webbluetooth-receipt-printer";

type LocalPrinterSettingsProps = PropsWithChildren<{

}>;

const LocalPrinterSettings: React.FunctionComponent<LocalPrinterSettingsProps> = ({
  children,
}) => {
  const [printer, setPrinter] = React.useState<TLocalPrinterContext | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timeout = setInterval(() => {
      router.refresh();
    }, 10_000);

    return () => clearInterval(timeout);
  }, [router]);

  const handleConnectClick = useCallback(async () => {
    // @ts-ignore
    // const WebUSBReceiptPrinter = (await import('@point-of-sale/webusb-receipt-printer/dist/webusb-receipt-printer.esm')).default;

    const receiptPrinter: WebUSBReceiptPrinterType = new WebUSBReceiptPrinter();

    const res = await new Promise<Omit<TLocalPrinterContext, 'autoPrint' | 'setAutoPrint'>>((resolve) => {
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

    const printerContext: TLocalPrinterContext = {
      ...res,
      autoPrint,
      setAutoPrint,
    };

    setPrinter(printerContext);
  }, [autoPrint, setAutoPrint]);

  const handleBluetoothConnectClick = useCallback(async () => {
    // @ts-ignore
    // const WebUSBReceiptPrinter = (await import('@point-of-sale/webusb-receipt-printer/dist/webusb-receipt-printer.esm')).default;

    const receiptPrinter: WebBluetoothReceiptPrinterType = new WebBluetoothReceiptPrinter();

    const res = await new Promise<Omit<TLocalPrinterContext, 'autoPrint' | 'setAutoPrint'>>((resolve) => {
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

    const printerContext: TLocalPrinterContext = {
      ...res,
      autoPrint,
      setAutoPrint,
    };

    setPrinter(printerContext);
  }, [autoPrint, setAutoPrint]);

  const handleAutoPrintToggle = useCallback(() => {
    const newAutoPrint = !autoPrint;
    setAutoPrint(newAutoPrint);

    if (printer) {
      setPrinter({
        ...printer,
        autoPrint: newAutoPrint,
        setAutoPrint,
      });
    }
  }, [autoPrint, printer, setAutoPrint]);

  return (
    <>
      <Section name="Lokale Druckereinstellungen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Button
            type="button"
            onClick={handleConnectClick}
          >
            Drucker verbinden
          </Button>
          <Button
            type="button"
            onClick={handleBluetoothConnectClick}
          >
            Bluetoothdrucker verbinden
          </Button>

          {printer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={autoPrint}
                  onChange={handleAutoPrintToggle}
                  style={{ marginRight: '0.5rem' }}
                />
                Auto-Druck aktivieren
              </label>
              {autoPrint && (
                <span style={{
                  color: 'green',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  ● Aktiv
                </span>
              )}
            </div>
          )}
        </div>
      </Section>
      <LocalPrinterProvider value={printer}>
        {children}
      </LocalPrinterProvider>
    </>
  );
};

export default LocalPrinterSettings;
