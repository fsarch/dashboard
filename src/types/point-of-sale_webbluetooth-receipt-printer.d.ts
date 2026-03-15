// src/main.d.ts

declare module "@point-of-sale/webbluetooth-receipt-printer" {
  export interface BluetoothReceiptPrinterDevice {
    type: "bluetooth";
    name?: string;
    id: string;
    manufacturerName?: string;
    productName?: string;
    serialNumber?: string;
    language?: string;
    codepageMapping?: any;
  }

  export interface BluetoothReceiptPrinterReconnectDevice {
    id: string;
  }

  export type BluetoothReceiptPrinterPrintData = ArrayBufferView | ArrayBufferView[];

  declare class ReceiptPrinterDriver {
  }

  class WebBluetoothReceiptPrinter extends ReceiptPrinterDriver {
    constructor();

    connect(): Promise<void>;

    reconnect(previousDevice: BluetoothReceiptPrinterReconnectDevice): Promise<void>;

    listen(): Promise<true | undefined>;

    disconnect(): Promise<void>;

    print(command: BluetoothReceiptPrinterPrintData): Promise<void>;

    addEventListener(event: "connected", listener: (device: BluetoothReceiptPrinterDevice) => void): void;
    addEventListener(event: "disconnected", listener: () => void): void;
    addEventListener(event: "data", listener: (data: DataView) => void): void;
    addEventListener(event: string, listener: (...args: any[]) => void): void;
  }

  export default WebBluetoothReceiptPrinter;
}
