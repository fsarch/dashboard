import { createContext, useContext } from "react";
import WebUSBReceiptPrinter from '@point-of-sale/webusb-receipt-printer';

export type TLocalPrinterContext = {
  printer: WebUSBReceiptPrinter;
  device: {
    type: 'usb';
    manufacturerName?: string;
    productName?: string;
    serialNumber?: string;
    vendorId: number;
    productId: number;
    language?: string;
    codepageMapping?: any;
  };
};

const LocalPrinterContext = createContext<TLocalPrinterContext | null>(null);
export const useLocalPrinter = () => useContext(LocalPrinterContext);
export const LocalPrinterProvider = LocalPrinterContext.Provider;
