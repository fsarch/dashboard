'use client';

import React, { ChangeEvent, useCallback, useState } from 'react';
import styles from './ShortCodeScannerBanner.module.scss';
import CodeScannerDialog from "@/components/universals/dialogs/code-scanner/CodeScannerDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import {
  analyzeShortCode
} from "@/app/(with-header)/material-tracing/[serviceId]/_components/ShortCodeScannerBanner.server-action";
import { useRouter } from "next/navigation";

type ShortCodeScannerBannerProps = {

};

const ShortCodeScannerBanner: React.FunctionComponent<ShortCodeScannerBannerProps> = () => {
  const [value, setValue] = useState('');
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, [setValue]);

  const openDialog = useOpenDialog();

  const router = useRouter();

  const redirectShortCode = useCallback(async (shortCode: string) => {
    const response = await analyzeShortCode(shortCode);

    router.push(response.url);
  }, [router]);

  const handleClick = useCallback(async () => {
    if (value) {
      await redirectShortCode(value);
      return
    }

    const dialog = openDialog(CodeScannerDialog, {
      enableQRCode: true,
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    setValue(result.value.value);
    await redirectShortCode(result.value.value);
  }, [value]);

  return (
    <div
      className={styles.root}
    >
      <button
        className={styles.button}
        onClick={handleClick}
      >

      </button>
      <input
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder="ShortCode"
      />
    </div>
  );
};

export default ShortCodeScannerBanner;
