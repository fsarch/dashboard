import React, { useEffect, useRef } from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import { codeScannerDialogUtils } from "@/components/universals/dialogs/code-scanner/CodeScannerDialog.utils";
import { BrowserDecoder } from "@/components/universals/dialogs/code-scanner/_utils/decoder/BrowserDecoder";
import { QuaggaDecoder } from "@/components/universals/dialogs/code-scanner/_utils/decoder/QuaggaDecoder";
import { QrDecoder } from "@/components/universals/dialogs/code-scanner/_utils/decoder/QrDecoder";

type CodeScannerDialogType = TDialogComponent<{ enableQRCode: boolean }, { value: string }>;

const CodeScannerDialog: CodeScannerDialogType = ({
  value,
  onResult,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const abortController = new AbortController();

    (async () => {
      const streamResponse = await codeScannerDialogUtils.getVideoStream({
        abortSignal: abortController.signal,
      });

      const barcodeDetector = await BrowserDecoder.IsSupported()
        ? new BrowserDecoder()
        : new QrDecoder();

      const draw = async () => {
        if (abortController.signal.aborted) {
          return;
        }

        if (!context) {
          return;
        }

        context.drawImage(
          streamResponse.video,
          0,
          0,
          streamResponse.video.videoWidth,
          streamResponse.video.videoHeight,
        );

        const response = await barcodeDetector.analyse(canvas);

        if (!response.results.length) {
          return;
        }

        const { rawValue } = response.results[0];

        abortController.abort();

        onResult({
          status: DialogResult.SUCCESS,
          value: {
            value: rawValue,
          },
        });
      }

      const interval = window.setInterval(() => {
        if (abortController.signal.aborted) {
          return;
        }

        canvas.width = streamResponse.video.videoWidth;
        canvas.height = streamResponse.video.videoHeight;

        requestAnimationFrame(() => {
          draw();
        });
      }, 100);

      abortController.signal.addEventListener('abort', () => {
        window.clearInterval(interval);
      });
    })();

    return () => {
      abortController.abort();
    }
  }, []);

  return (
    <Dialog>
      <canvas
        ref={canvasRef}
      />
      <button onClick={() => onResult({ status: DialogResult.CANCEL })}>Abbrechen</button>
    </Dialog>
  );
};

export default CodeScannerDialog;
