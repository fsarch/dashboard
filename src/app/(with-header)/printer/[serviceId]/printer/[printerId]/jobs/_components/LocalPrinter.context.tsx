import { createContext, useContext } from "react";
import WebUSBReceiptPrinter from '@point-of-sale/webusb-receipt-printer';
import WebBluetoothReceiptPrinter from '@point-of-sale/webbluetooth-receipt-printer';
import type { BluetoothReceiptPrinterDevice } from '@point-of-sale/webbluetooth-receipt-printer';

export type TUSBPrinterDevice = {
  type: 'usb';
  manufacturerName?: string;
  productName?: string;
  serialNumber?: string;
  vendorId: number;
  productId: number;
  language?: string;
  codepageMapping?: any;
};

export type TLocalPrinterContext = {
  printer: WebUSBReceiptPrinter | WebBluetoothReceiptPrinter;
  device: TUSBPrinterDevice | BluetoothReceiptPrinterDevice;
  autoPrint: boolean;
  setAutoPrint: (enabled: boolean) => void;
};

const LocalPrinterContext = createContext<TLocalPrinterContext | null>(null);
export const useLocalPrinter = () => useContext(LocalPrinterContext);
export const LocalPrinterProvider = LocalPrinterContext.Provider;
