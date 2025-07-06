import Quagga from '@ericblade/quagga2';
import { BarcodeDecodeResponse, IDecoder } from "./IDecoder";


export class QuaggaDecoder implements IDecoder {
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
      return { type: 'quagga', results: [], };
    }

    analyzeCanvasCtx.filter = 'saturate(10%) contrast(200%)';
    analyzeCanvasCtx.drawImage(canvas, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      this.analyzeCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('could not get blob'));
          return;
        }

        resolve(blob);
      });
    });

    const objectUrl = URL.createObjectURL(blob);

    try {
      const response = await Quagga.decodeSingle({
        src: objectUrl,
        numOfWorkers: 1,
        frequency: 10,
        decoder : {
          readers : ["ean_reader"]
        },
      });

      if (response?.codeResult?.code) {
        return {
          type: 'quagga',
          results: [{
            rawValue: response.codeResult.code,
          }]
        }
      }

      return { type: 'quagga', results: [], };
    } catch (ex) {
      console.error(ex);
      return { type: 'quagga', results: [], };
    } finally {
      URL.revokeObjectURL(objectUrl);

    }
  }
}
