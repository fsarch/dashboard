'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { QRCodeType } from "@/components/universals/qr-code/QRCodeType.enum";
import Button from "@/components/universals/forms/Button";
import { generateQrCode } from "@/components/universals/qr-code/QRCode.utils";

type QrCodeDownloadButtonProps = PropsWithChildren<{
  type: QRCodeType;
  value: string;
  open?: boolean;
}>;

function downloadBase64File(contentType: string, base64Data: string, fileName: string) {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

const QrCodeDownloadButton: React.FunctionComponent<QrCodeDownloadButtonProps> = ({
  children,
  type,
  value,
  open,
}) => {
  const handleClick = useCallback(async () => {
    const response = await generateQrCode({
      value,
    });

    const contentType = 'application/pdf';

    if (open) {
      const string = `data:${contentType};base64,${response.base64}`;
      const iframe = "<iframe width='100%' height='100%' style='border: 0; outline: 0;' src='" + string + "'></iframe>"
      const x = window.open();

      if (!x) {
        return;
      }

      x.document.open();
      x.document.write(iframe);
      x.document.body.style.margin = '0px';
      x.document.body.style.padding = '0px';
      x.document.body.style.outline = '0px';
      x.document.close();
    } else {
      downloadBase64File(contentType, response.base64, `${value}.pdf`);
    }
  }, [value, open]);

  return (
    <Button
      type="button"
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default QrCodeDownloadButton;
