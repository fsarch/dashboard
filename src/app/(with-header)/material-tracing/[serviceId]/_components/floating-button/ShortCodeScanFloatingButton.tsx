'use client';

import React, { useCallback } from 'react';
import FloatingButton from "@/components/universals/floating-button/FloatingButton";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { useRouter } from "next/navigation";
import {
  analyzeShortCode
} from "@/app/(with-header)/material-tracing/[serviceId]/_components/ShortCodeScannerBanner.server-action";
import CodeScannerDialog from "@/components/universals/dialogs/code-scanner/CodeScannerDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";

type ShortCodeScanFloatingButtonProps = {

};

const ShortCodeScanFloatingButton: React.FunctionComponent<ShortCodeScanFloatingButtonProps> = () => {
  const openDialog = useOpenDialog();

  const router = useRouter();

  const handleClick = useCallback(async () => {
    const dialog = openDialog(CodeScannerDialog, {
      enableQRCode: true,
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    const response = await analyzeShortCode(result.value.value);

    router.push(response.url);
  }, []);

  return (
    <FloatingButton
      onClick={handleClick}
      icon="qrcode"
    />
  );
};

export default ShortCodeScanFloatingButton;
