// Type definitions for ReceiptPrinterEncoder
// Project: https://github.com/NielsLeenheer/ReceiptPrinterEncoder

declare module "@point-of-sale/receipt-printer-encoder" {
  export type PrinterLanguage = "esc-pos" | "star-prnt" | "star-line";
  export type Alignment = "left" | "center" | "right";
  export type BarcodeSymbology =
    | "upca" | "upce" | "ean13" | "ean8"
    | "code39" | "itf" | "codabar" | "code93"
    | "code128" | "gs1-databar-omni" | "gs1-databar-truncated"
    | "gs1-databar-limited" | "gs1-databar-expanded"
    | string;

  export interface PrinterCapabilities {
    fonts: {
      [font: string]: { size: string; columns: number }
    };
    barcodes: {
      supported: boolean;
      symbologies: BarcodeSymbology[];
    };
    qrcode: {
      supported: boolean;
      models: string[];
    };
    pdf417: {
      supported: boolean;
      fallback?: { symbology: BarcodeSymbology };
    };
    [key: string]: any;
  }

  export interface TableColumn {
    width: number;
    align?: Alignment;
    verticalAlign?: "top" | "bottom";
    marginLeft?: number;
    marginRight?: number;
  }

  export interface TableOptions {
    columns: TableColumn[];
    data: (string | ((encoder: ReceiptPrinterEncoder) => void))[][];
  }

  export interface RuleOptions {
    style?: "single" | "double";
    width?: number;
  }

  export interface BoxOptions {
    style?: "single" | "double" | "none";
    width?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingLeft?: number;
    paddingRight?: number;
    align?: Alignment;
  }

  export interface BarcodeOptions {
    height?: number;
    width?: number;
    text?: boolean;
  }

  export interface QRCodeOptions {
    model?: number;
    size?: number;
    errorlevel?: "l" | "m" | "q" | "h";
  }

  export interface PDF417Options {
    width?: number;
    height?: number;
    columns?: number;
    rows?: number;
    errorlevel?: number;
    truncated?: boolean;
  }

  export interface ReceiptPrinterEncoderOptions {
    columns?: number;
    language?: PrinterLanguage;
    imageMode?: string;
    feedBeforeCut?: number;
    newline?: string;
    codepageMapping?: string | object;
    codepageCandidates?: string[];
    errors?: "relaxed" | "strict";
    printerModel?: string;
    debug?: boolean;
    embedded?: boolean;
    createCanvas?: ((width: number, height: number) => any) | null;
    width?: number;
    autoFlush?: boolean;
  }

  export interface Command {
    type: string;
    payload?: any;
    value?: any;
    property?: string;
    codepage?: string;
  }

  export interface CommandLine {
    commands: Command[];
    height: number;
  }

  export class ReceiptPrinterEncoder {
    constructor(options?: ReceiptPrinterEncoderOptions);

    static get printerModels(): {id: string; name: string}[];

    get columns(): number;
    get language(): string;
    get printerCapabilities(): PrinterCapabilities;

    initialize(): this;
    codepage(codepage: string): this;

    text(value: string): this;
    newline(value?: number): this;
    line(value: string): this;

    underline(value?: boolean | number): this;
    italic(value?: boolean): this;
    bold(value?: boolean): this;
    invert(value?: boolean): this;

    width(width: number): this;
    height(height: number): this;
    size(width: number | string, height?: number): this;
    font(value: string): this;
    align(value: Alignment): this;

    table(columns: TableColumn[], data: (string | ((encoder: ReceiptPrinterEncoder) => void))[][]): this;
    rule(options?: RuleOptions): this;
    box(options: BoxOptions, contents: string | ((encoder: ReceiptPrinterEncoder) => void)): this;

    barcode(value: string, symbology: BarcodeSymbology, options?: number | BarcodeOptions): this;
    qrcode(value: string, options?: number | QRCodeOptions, size?: number, errorlevel?: string): this;
    pdf417(value: string, options?: PDF417Options): this;

    image(
      input: any,
      width: number,
      height: number,
      algorithm?: "threshold" | "bayer" | "floydsteinberg" | "atkinson",
      threshold?: number
    ): this;

    cut(value?: "full" | "partial"): this;
    pulse(device?: number, on?: number, off?: number): this;

    raw(data: any[]): this;

    commands(): CommandLine[];
    encode(format?: "commands" | "lines" | "array"): Uint8Array | CommandLine[] | Command[][];

    // ... other internal/private methods not exposed in d.ts
  }

  export default ReceiptPrinterEncoder;
}
