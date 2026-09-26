'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import Button from '@/components/universals/forms/Button';
import type { TRecordDto } from '@/services/dblight/dblight.type';
import { datetimeUtils } from '@/utils/datetime.utils';
import { deleteRecordAction } from './RecordActions.server-action';
import RecordForm from './RecordForm.component';

type RecordDetailProps = {
  record: TRecordDto;
  serviceId: string;
  collectionId: string;
};

const RecordDetail: React.FunctionComponent<RecordDetailProps> = ({
  record,
  serviceId,
  collectionId,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleDelete = useCallback(async () => {
    const dialogResult = await openDialog(AlertDialog, {
      text: `Eintrag "${record.id}" löschen?`,
      buttonText: 'Löschen',
      buttonColor: '#d32f2f',
    }).result;

    if (dialogResult.status !== DialogResult.SUCCESS) {
      return;
    }

    try {
      await deleteRecordAction(serviceId, collectionId, record.id);
      router.push(`/dblight/${serviceId}/collection/${collectionId}/record`);
      router.refresh();
    } catch (error) {
      await openDialog(AlertDialog, {
        text: `Fehler beim Löschen: ${error instanceof Error ? error.message : String(error)}`,
        buttonText: 'OK',
      });
    }
  }, [record.id, serviceId, collectionId, router, openDialog]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <th
              style={{
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
                textAlign: 'left',
                backgroundColor: 'var(--color-background-tertiary)',
                fontWeight: 600,
              }}
            >
              ID
            </th>
            <td
              style={{
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
              }}
            >
              <code>{record.id}</code>
            </td>
          </tr>
          <tr>
            <th
              style={{
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
                textAlign: 'left',
                backgroundColor: 'var(--color-background-tertiary)',
                fontWeight: 600,
              }}
            >
              Erstellt
            </th>
            <td
              style={{
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
              }}
            >
              {datetimeUtils.formatDate(record.createdAt)}
            </td>
          </tr>
          <tr>
            <th
              style={{
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
                textAlign: 'left',
                backgroundColor: 'var(--color-background-tertiary)',
                fontWeight: 600,
              }}
            >
              Zuletzt geändert
            </th>
            <td
              style={{
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
              }}
            >
              {datetimeUtils.formatDate(record.updatedAt)}
            </td>
          </tr>
        </tbody>
      </table>

      <RecordForm
        serviceId={serviceId}
        collectionId={collectionId}
        recordId={record.id}
        initialData={record.data}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button type="button" onClick={handleDelete} color="#d32f2f">
          Eintrag löschen
        </Button>
        <Link
          href={`/dblight/${serviceId}/collection/${collectionId}/record`}
          passHref
        >
          <Button type="button">Zurück zur Liste</Button>
        </Link>
      </div>
    </div>
  );
};

export default RecordDetail;
