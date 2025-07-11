// src/main.d.ts

declare module "@point-of-sale/webusb-receipt-printer" {
  declare class EventEmitter {
    on(event: string, listener: (...args: any[]) => void): this;

    emit(event: string, ...args: any[]): boolean;
  }

  interface DeviceProfile {
    filters: Array<{ vendorId?: number; productId?: number }>;
    configuration: number;
    interface: number;
    language?: string | ((device: USBDevice) => Promise<string> | string);
    codepageMapping?: any | ((device: USBDevice) => Promise<any> | any);
  }

  declare const DeviceProfiles: DeviceProfile[];

  declare class ReceiptPrinterDriver {
  }

  declare class USBDevice {
    vendorId: number;
    productId: number;
    serialNumber?: string;
    manufacturerName?: string;
    productName?: string;

    open(): Promise<void>;

    selectConfiguration(configurationValue: number): Promise<void>;

    claimInterface(interfaceNumber: number): Promise<void>;

    close(): Promise<void>;

    reset(): Promise<void>;

    configuration: {
      interfaces: Array<{
        interfaceNumber: number;
        alternate: {
          endpoints: Array<{
            direction: 'in' | 'out';
            endpointNumber: number;
          }>;
        };
      }>;
    };

    transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;

    transferOut(endpointNumber: number, data: BufferSource): Promise<any>;
  }

  declare class USBInTransferResult {
    data: DataView;
  }

  declare class WebUSBReceiptPrinter extends ReceiptPrinterDriver {
    constructor();

    connect(): Promise<void>;

    reconnect(previousDevice: USBDevice): Promise<void>;

    listen(): Promise<true | undefined>;

    disconnect(): Promise<void>;

    print(command: BufferSource): Promise<void>;

    addEventListener(event: 'connected', listener: (info: {
      type: 'usb';
      manufacturerName?: string;
      productName?: string;
      serialNumber?: string;
      vendorId: number;
      productId: number;
      language?: string;
      codepageMapping?: any;
    }) => void): void;
    addEventListener(event: 'disconnected', listener: () => void): void;
    addEventListener(event: 'data', listener: (data: DataView) => void): void;
    addEventListener(event: string, listener: (...args: any[]) => void): void;
  }

  export = WebUSBReceiptPrinter;
}
