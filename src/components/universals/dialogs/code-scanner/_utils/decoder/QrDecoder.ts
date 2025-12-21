import { BarcodeDecodeResponse, IDecoder } from "./IDecoder";
import jsQR from "jsqr";

export class QrDecoder implements IDecoder {
  private analyzeCanvas: HTMLCanvasElement;

  constructor() {
    this.analyzeCanvas = document.createElement('canvas');
  }

  public static async IsSupported(): Promise<boolean> {
    return true;
  }

  async analyse(canvas: HTMLCanvasElement): Promise<BarcodeDecodeResponse> {
    this.analyzeCanvas.width = canvas.width;
    this.analyzeCanvas.height = canvas.height;

    const analyzeCanvasCtx = this.analyzeCanvas.getContext('2d');
    if (!analyzeCanvasCtx) {
      return { type: 'qr-scanner', results: [], };
    }

    analyzeCanvasCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    try {
      const response = jsQR(
        analyzeCanvasCtx.getImageData(0, 0, this.analyzeCanvas.width, this.analyzeCanvas.height).data,
        this.analyzeCanvas.width,
        this.analyzeCanvas.height,
      );

      if (response?.data) {
        return {
          type: 'qr-scanner',
          results: [{
            rawValue: response.data,
          }]
        }
      }

      return { type: 'qr-scanner', results: [], };
    } catch (ex) {
      if (ex !== 'No QR code found') {
        console.error(ex);
      }

      return { type: 'qr-scanner', results: [], };
    } finally {
      // ignore
    }
  }
}
