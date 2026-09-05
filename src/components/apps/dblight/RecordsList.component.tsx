'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TRecordPageDto } from '@/services/dblight/dblight.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { deleteRecordAction } from './RecordActions.server-action';

type RecordsListProps = {
  page: TRecordPageDto;
  serviceId: string;
  collectionId: string;
};

function previewData(data: Record<string, unknown>): string {
  const json = JSON.stringify(data);
  return json.length > 120 ? `${json.slice(0, 120)}…` : json;
}

const RecordsList: React.FunctionComponent<RecordsListProps> = ({
  page,
  serviceId,
  collectionId,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleDelete = useCallback(
    async (recordId: string) => {
      const dialogResult = await openDialog(AlertDialog, {
        text: `Eintrag "${recordId}" löschen?`,
        buttonText: 'Löschen',
        buttonColor: '#d32f2f',
      }).result;

      if (dialogResult.status !== DialogResult.SUCCESS) {
        return;
      }

      try {
        await deleteRecordAction(serviceId, collectionId, recordId);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Löschen: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
      }
    },
    [serviceId, collectionId, router, openDialog],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href={`/dblight/${serviceId}/collection/${collectionId}/record/create`} passHref>
          <Button type="button">
            Eintrag hinzufügen
          </Button>
        </Link>
      </div>

      {page.data.length > 0 ? (
        <List>
          {page.data.map((record) => (
            <div key={record.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                href={`/dblight/${serviceId}/collection/${collectionId}/record/${record.id}`}
                style={{ flex: 1 }}
              >
                <ListItem>
                  <code>{record.id}</code>
                  <br />
                  <small>{previewData(record.data)}</small>
                </ListItem>
              </Link>
              <div style={{ flexShrink: 0 }}>
                <Button
                  type="button"
                  color="#d32f2f"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleDelete(record.id);
                  }}
                >
                  Löschen
                </Button>
              </div>
            </div>
          ))}
        </List>
      ) : (
        <p>Keine Einträge gefunden.</p>
      )}

      {page.nextCursor && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href={`/dblight/${serviceId}/collection/${collectionId}/record?cursor=${encodeURIComponent(page.nextCursor)}`}
            passHref
          >
            <Button type="button">
              Nächste Seite
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecordsList;
