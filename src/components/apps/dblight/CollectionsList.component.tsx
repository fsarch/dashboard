'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TCollectionDto } from '@/services/dblight/dblight.type';
import { datetimeUtils } from '@/utils/datetime.utils';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { deleteCollectionAction } from './CollectionActions.server-action';

type CollectionsListProps = {
  collections: Array<TCollectionDto>;
  serviceId: string;
};

const CollectionsList: React.FunctionComponent<CollectionsListProps> = ({
  collections,
  serviceId,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleDelete = useCallback(
    async (collection: TCollectionDto) => {
      const dialogResult = await openDialog(AlertDialog, {
        text: `Collection "${collection.name}" inklusive aller Einträge unwiderruflich löschen?`,
        buttonText: 'Löschen',
        buttonColor: '#d32f2f',
      }).result;

      if (dialogResult.status !== DialogResult.SUCCESS) {
        return;
      }

      try {
        await deleteCollectionAction(serviceId, collection.id);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Löschen: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
      }
    },
    [serviceId, router, openDialog],
  );

  if (collections.length === 0) {
    return <p>Noch keine Collections vorhanden.</p>;
  }

  return (
    <List>
      {collections.map((collection) => (
        <div key={collection.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/dblight/${serviceId}/collection/${collection.id}`} style={{ flex: 1 }}>
            <ListItem>
              <strong>{collection.name}</strong>
              <br />
              <small>
                Schema-Version {collection.currentSchemaVersion} · Erstellt{' '}
                {datetimeUtils.formatDate(collection.createdAt)}
              </small>
            </ListItem>
          </Link>
          <div style={{ flexShrink: 0 }}>
            <Button
              type="button"
              color="#d32f2f"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleDelete(collection);
              }}
            >
              Löschen
            </Button>
          </div>
        </div>
      ))}
    </List>
  );
};

export default CollectionsList;
