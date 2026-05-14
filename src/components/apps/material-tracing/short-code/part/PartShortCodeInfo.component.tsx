import React from 'react';
import Link from "next/link";
import PartShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/part/PartShortCodeDeleteForm.component";
import { partService } from "@/services/material-tracing/part.service";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import styles from './PartShortCodeInfo.module.scss';

type PartShortCodeInfoComponentProps = {
  code: string;
};

const PartShortCodeInfoComponent: React.FunctionComponent<PartShortCodeInfoComponentProps> = async ({
  code,
}) => {
  const parts = await partService.listPartsByShortCode(code);
  const part = parts[0];
  const partUrl = part ? await getServiceLocalUrl(`/part/${part.id}`) : null;

  return (
    <div className={styles.root}>
      {part ? (
        <>
          <Link href={partUrl!} className={styles.itemCard}>
            <div className={styles.itemLabel}>Verbundenes Bauteil</div>
            Name: {part.name}<br />
            ID: {part.id}<br />
            Anzahl: {part.amount}
          </Link>

          <div className={styles.actions}>
            <div className={styles.actionsLabel}>Verbindung aufheben</div>
            <PartShortCodeDeleteForm
              args={{
                partId: part.id,
                shortCode: code,
              }}
            />
          </div>
        </>
      ) : <div className={styles.empty}>Kein verbundenes Bauteil gefunden.</div>}
    </div>
  );
};

export default PartShortCodeInfoComponent;
