'use client';

import type React from 'react';
import { useCallback } from 'react';
import { useLocalPrinter } from '@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinter.context';
import IconActionButton from '@/components/universals/forms/button/IconActionButton';
import type { PrintJobDto } from '@/services/printer/printer.type';
import { executeAutoPrintJob } from './LocalPrinter.utils';

type LocalPrinterPrintIconProps = {
  job: PrintJobDto;
};

const LocalPrinterPrintIcon: React.FunctionComponent<
  LocalPrinterPrintIconProps
> = ({ job }) => {
  const localPrinter = useLocalPrinter();

  const handlePrintClick = useCallback(async () => {
    if (!localPrinter) {
      return;
    }

    try {
      await executeAutoPrintJob(localPrinter, job);
    } catch (error) {
      console.error('Print failed:', error);
      // TODO: Consider showing user-friendly error message
    }
  }, [localPrinter, job]);

  if (!localPrinter) {
    return null;
  }

  return (
    <IconActionButton
      icon="print"
      type="button"
      onClick={handlePrintClick}
    ></IconActionButton>
  );
};

export default LocalPrinterPrintIcon;
