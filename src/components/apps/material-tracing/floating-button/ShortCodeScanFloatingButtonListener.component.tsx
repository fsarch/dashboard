'use client';

import { useCallback } from 'react';
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { useRouter } from "next/navigation";
import {
  analyzeShortCode
} from "@/app/(with-header)/material-tracing/[serviceId]/_components/ShortCodeScannerBanner.server-action";
import CodeScannerDialog from "@/components/universals/dialogs/code-scanner/CodeScannerDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import { useFloatingButtonClick } from "@/components/universals/floating-button/FloatingButtonProvider.context";
import {
  MATERIAL_TRACING_SHORT_CODE_SCAN_FLOATING_BUTTON_ID
} from "@/constants/apps/material-tracing/material-tracing.floating-button.const";

// Renders nothing - just registers the click behaviour for the floating
// button configured with MATERIAL_TRACING_SHORT_CODE_SCAN_FLOATING_BUTTON_ID
// (see MaterialTracingAppDefinition), which is rendered generically by
// DefaultPage via AutoFloatingButton.
const ShortCodeScanFloatingButtonListener: React.FunctionComponent = () => {
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
  }, [openDialog, router]);

  useFloatingButtonClick(MATERIAL_TRACING_SHORT_CODE_SCAN_FLOATING_BUTTON_ID, handleClick);

  return null;
};

export default ShortCodeScanFloatingButtonListener;
