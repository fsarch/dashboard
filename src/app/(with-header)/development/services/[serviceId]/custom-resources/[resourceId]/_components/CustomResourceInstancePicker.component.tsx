'use client';

import React, { useCallback, useState } from 'react';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import Button from '@/components/universals/forms/Button';
import { TCustomResourceDefinition } from '@/utils/app/custom-resources';
import SelectCustomResourceDialog from '@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.component';
import styles from './CustomResourceInstancePicker.module.scss';

type CustomResourceInstancePickerProps = {
  serviceId: string;
  resource: TCustomResourceDefinition;
};

const CustomResourceInstancePicker: React.FunctionComponent<CustomResourceInstancePickerProps> = ({
  serviceId,
  resource,
}) => {
  const openDialog = useOpenDialog();
  const [result, setResult] = useState<unknown>(undefined);

  const handleOpen = useCallback(async () => {
    const { result: dialogResult } = openDialog(SelectCustomResourceDialog, { serviceId, resource });
    const outcome = await dialogResult;
    if (outcome.status === DialogResult.SUCCESS) {
      setResult(outcome.value);
    }
  }, [openDialog, serviceId, resource]);

  const hasListRoute = Boolean(resource.apiRoutes.list);

  return (
    <div className={styles.root}>
      <h3>Instanz testen</h3>
      <Button type="button" onClick={handleOpen} disabled={!hasListRoute}>
        Instanz auswählen
      </Button>
      {!hasListRoute && (
        <p className={styles.hint}>Dieser Typ hat keinen List-Endpunkt.</p>
      )}
      {result !== undefined && (
        <pre className={styles.raw}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CustomResourceInstancePicker;
