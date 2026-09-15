'use client';

import React, { useCallback, useState } from 'react';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import Button from '@/components/universals/forms/Button';
import { EServiceType } from '@/utils/configuration.type';
import { TCustomResourceDefinition } from '@/utils/app/custom-resources';
import SelectCustomResourceDialog from '@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.component';
import styles from './CustomResourceInstancePicker.module.scss';

type CustomResourceInstancePickerProps = {
  appType: EServiceType;
  resource: TCustomResourceDefinition;
};

// Service-übergreifende Variante des Instanz-Pickers: anders als die
// service-gebundene Version (development/services/[serviceId]/…) wird hier
// keine serviceId vorgegeben - der Dialog fragt zuerst nach dem konkreten
// Service (gefiltert auf appType) und springt danach direkt zur
// Instanz-Auswahl, da der Typ bereits feststeht.
const CustomResourceInstancePicker: React.FunctionComponent<CustomResourceInstancePickerProps> = ({
  appType,
  resource,
}) => {
  const openDialog = useOpenDialog();
  const [result, setResult] = useState<unknown>(undefined);

  const handleOpen = useCallback(async () => {
    const { result: dialogResult } = openDialog(SelectCustomResourceDialog, { appType, resource });
    const outcome = await dialogResult;
    if (outcome.status === DialogResult.SUCCESS) {
      setResult(outcome.value);
    }
  }, [openDialog, appType, resource]);

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
