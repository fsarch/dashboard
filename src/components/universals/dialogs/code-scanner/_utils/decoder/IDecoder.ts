export type BarcodeDecodeResult = {
  rawValue: string;
};

export type BarcodeDecodeResponse = {
  type: string;
  results: Array<BarcodeDecodeResult>;
};

export interface IDecoder {
  analyse(canvas: HTMLCanvasElement): Promise<BarcodeDecodeResponse>;
}
