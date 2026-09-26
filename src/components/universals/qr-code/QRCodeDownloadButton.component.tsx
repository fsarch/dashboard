'use client';

import type React from 'react';
import { type PropsWithChildren, useCallback } from 'react';
import Button from '@/components/universals/forms/Button';
import { generateQrCode } from '@/components/universals/qr-code/QRCode.utils';
import type { QRCodeType } from '@/components/universals/qr-code/QRCodeType.enum';
import { base64Utils } from '@/utils/base64.utils';

type QrCodeDownloadButtonProps = PropsWithChildren<{
  type: QRCodeType;
  value: string;
  open?: boolean;
}>;

const QrCodeDownloadButton: React.FunctionComponent<
  QrCodeDownloadButtonProps
> = ({ children, type, value, open }) => {
  const handleClick = useCallback(async () => {
    const response = await generateQrCode({
      values: [value],
    });

    const contentType = 'application/pdf';

    if (open) {
      base64Utils.open(contentType, response.base64);
    } else {
      base64Utils.download(contentType, response.base64, `${value}.pdf`);
    }
  }, [value, open]);

  return (
    <Button type="button" onClick={handleClick}>
      {children}
    </Button>
  );
};

export default QrCodeDownloadButton;
