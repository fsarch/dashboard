'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { colors } from '@/app/_styles/colors';
import Badge from '@/components/universals/badge/badge.component';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import Button from '@/components/universals/forms/Button';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import type { FunctionVersionDto } from '@/services/function/function.type';
import { activateVersionAction } from './Versions.server-action';
import styles from './VersionsList.module.scss';

type VersionsListProps = {
  serviceId: string;
  functionId: string;
  versions: FunctionVersionDto[];
};

const VersionsList: React.FunctionComponent<VersionsListProps> = ({
  serviceId,
  functionId,
  versions,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleActivate = useCallback(
    async (versionId: string) => {
      const dialogResult = await openDialog(AlertDialog, {
        text: 'Soll diese Version wirklich als aktive Version veröffentlicht werden?',
        buttonText: 'Aktivieren',
      }).result;

      if (dialogResult.status === DialogResult.SUCCESS) {
        await activateVersionAction(serviceId, functionId, versionId);
        router.refresh();
      }
    },
    [openDialog, router, serviceId, functionId],
  );

  return (
    <List>
      {versions.map((version) => (
        <ListItem key={version.id}>
          <div className={styles.headerRow}>
            <Link
              href={`/function/${serviceId}/function/${functionId}/versions/${version.id}`}
            >
              {version.externalId || version.id} - {version.creationTime}
            </Link>
            {version.isActive ? (
              <Badge color={colors.lightGreen}>aktiv</Badge>
            ) : (
              <Button type="button" onClick={() => handleActivate(version.id)}>
                Aktivieren
              </Button>
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default VersionsList;
