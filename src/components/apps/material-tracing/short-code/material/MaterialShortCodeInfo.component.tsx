import React from 'react';
import Link from "next/link";
import { materialService } from "@/services/material-tracing/material.service";
import MaterialShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeDeleteForm.component";
import MaterialInfo from "@/components/apps/material-tracing/material/MaterialInfo.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import styles from './MaterialShortCodeInfo.module.scss';

type MaterialShortCodeInfoComponentProps = {
  code: string;
};

const MaterialShortCodeInfoComponent: React.FunctionComponent<MaterialShortCodeInfoComponentProps> = async ({
  code,
}) => {
  const materials = await materialService.listMaterialsByShortCode(code);
  const material = materials[0];
  const materialUrl = material ? await getServiceLocalUrl(`/material/${material.id}`) : null;

  return (
    <div className={styles.root}>
      {material ? (
        <Link href={materialUrl!} className={styles.itemCard}>
          <div className={styles.itemLabel}>Verbundenes Material</div>
          <MaterialInfo
            material={material}
          />
        </Link>
      ) : <div className={styles.empty}>Kein verbundenes Material gefunden.</div>}
      {material ? (
        <div className={styles.actions}>
          <div className={styles.actionsLabel}>Verbindung aufheben</div>
          <MaterialShortCodeDeleteForm
            args={{
              materialId: material.id,
              shortCode: code,
            }}
          />
        </div>
      ) : undefined}
    </div>
  );
};

export default MaterialShortCodeInfoComponent;
