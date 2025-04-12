'use server';

import QRCode from "qrcode";

import { renderPdf } from "@/components/apps/pdf-render/PdfRenderForm.server-action";

export async function generateQrCode({
  value,
}: {
  value: string;
}) {
  const qrCodeDataUrl = await QRCode.toDataURL(value);

  const size = 400;
  const width = size;
  const height = size;

  const html = `
    <html>
    <body style="margin: 0; padding: 0;">
    <div style="padding: 2vmax">
        <div style="border-radius: 100vmax; width: 96vw; height: 96vh; overflow: hidden; position: relative; box-sizing: border-box">
            <img src="${qrCodeDataUrl}" style="top: 4vh; width: 75vw; height: 75vh; position: absolute; left: 50%; transform: translateX(-50%)"/>
            <div style="position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); font-family: Arial, sans-serif">${value}</div>
        </div>
    </div>
    </body>
    </html>
  `;

  return renderPdf({
    content: {
      html,
    },
    options: {
      export: {
        format: 'custom',
        width: '5cm',
        height: '5cm',
      },
      viewport: {
        width: 1024,
        height: 1024,
      },
    },
  });
}
