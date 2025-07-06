import { BarcodeDecodeResponse, IDecoder } from "./IDecoder";

export class BrowserDecoder implements IDecoder {
  private barcodeDecoder: any;

  public static async IsSupported(): Promise<boolean> {
    if (!('BarcodeDetector' in globalThis)) {
      return false;
    }

    const supportedFormat = await (window as any).BarcodeDetector.getSupportedFormats();
    return true;
  }

  constructor() {
    this.barcodeDecoder = new (window as any).BarcodeDetector({
      formats: ['ean_13', 'ean_8'],
    });
  }

  async analyse(canvas: HTMLCanvasElement): Promise<BarcodeDecodeResponse> {
    const barcodes = await this.barcodeDecoder.detect(canvas);

    return {
      type: 'browser',
      results: barcodes.map((barcode: { rawValue: string }) => ({
        rawValue: barcode.rawValue,
      })),
    };
  }

}
