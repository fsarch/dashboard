'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { TCollectionDto, TSchemaVersionDto } from '@/services/dblight/dblight.type';
import { datetimeUtils } from '@/utils/datetime.utils';
import Button from '@/components/universals/forms/Button';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { deleteCollectionAction } from './CollectionActions.server-action';

// `ssr: false` because SchemaViewer pulls in `monaco-editor`, which throws
// during server rendering (see RecordForm.component.tsx).
const SchemaViewer = dynamic(() => import('./SchemaViewer.component'), {
  ssr: false,
});

type CollectionDetailProps = {
  collection: TCollectionDto;
  schema: Record<string, unknown>;
  schemaVersions: Array<TSchemaVersionDto>;
  serviceId: string;
};

const CollectionDetail: React.FunctionComponent<CollectionDetailProps> = ({
  collection,
  schema,
  schemaVersions,
  serviceId,
}) => {
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleDelete = useCallback(async () => {
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
      router.push(`/dblight/${serviceId}`);
      router.refresh();
    } catch (error) {
      await openDialog(AlertDialog, {
        text: `Fehler beim Löschen: ${error instanceof Error ? error.message : String(error)}`,
        buttonText: 'OK',
      });
    }
  }, [collection.id, collection.name, serviceId, router, openDialog]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              <code>{collection.id}</code>
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Aktuelle Schema-Version
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {collection.currentSchemaVersion}
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Erstellt
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {datetimeUtils.formatDate(collection.createdAt)}
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
          JSON Schema (aktive Version)
        </div>
        <SchemaViewer schema={schema} />
      </div>

      <div>
        <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
          Schema-Versionen
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
                Version
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
                Erstellt
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[...schemaVersions]
              .sort((a, b) => b.version - a.version)
              .map((version) => (
                <tr key={version.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
                    {version.version}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
                    {datetimeUtils.formatDate(version.createdAt)}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
                    {version.id === collection.currentSchemaVersionId ? 'aktiv' : ''}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link href={`/dblight/${serviceId}/collection/${collection.id}/record`} passHref>
          <Button type="button">
            Einträge anzeigen
          </Button>
        </Link>
        <Link href={`/dblight/${serviceId}/collection/${collection.id}/record/create`} passHref>
          <Button type="button">
            Eintrag hinzufügen
          </Button>
        </Link>
        <Link href={`/dblight/${serviceId}/collection/${collection.id}/schema/create`} passHref>
          <Button type="button">
            Schema-Version anlegen
          </Button>
        </Link>
        <Button type="button" onClick={handleDelete} color="#d32f2f">
          Collection löschen
        </Button>
        <Link href={`/dblight/${serviceId}`} passHref>
          <Button type="button">
            Zurück zur Liste
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CollectionDetail;
