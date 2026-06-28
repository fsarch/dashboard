'use client';

import React from 'react';
import { TMetricDto } from '@/services/metric/metric.type';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';
import { deleteMetricAction, restoreMetricAction } from '@/app/(with-header)/metric/[serviceId]/metric/_components/MetricActions.server-action';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useRouter } from 'next/navigation';

type MetricDetailProps = {
  metric: TMetricDto;
  serviceId: string;
};

const MetricDetail: React.FunctionComponent<MetricDetailProps> = ({ metric, serviceId }) => {
  const router = useRouter();
  const openDialog = useOpenDialog();
  const isDeleted = metric.deletionTime !== null;

  const handleDelete = async () => {
    const dialogResult = await openDialog(AlertDialog, {
      text: `Sind Sie sicher, dass Sie die Metrik "${metric.name}" löschen möchten?`,
      buttonText: 'Löschen',
      buttonColor: '#d32f2f',
    }).result;

    if (dialogResult.status === DialogResult.SUCCESS) {
      try {
        await deleteMetricAction(serviceId, metric.id);
        router.push(`/metric/${serviceId}/metric`);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Löschen der Metrik: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
      }
    }
  };

  const handleRestore = async () => {
    const dialogResult = await openDialog(AlertDialog, {
      text: `Sind Sie sicher, dass Sie die Metrik "${metric.name}" wiederherstellen möchten?`,
      buttonText: 'Wiederherstellen',
    }).result;

    if (dialogResult.status === DialogResult.SUCCESS) {
      try {
        await restoreMetricAction(serviceId, metric.id);
        router.push(`/metric/${serviceId}/metric`);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Wiederherstellen der Metrik: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              <code>{metric.id}</code>
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Name
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {metric.name}
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Metric Type ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              <code>{metric.metricTypeId}</code>
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              External ID
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {metric.externalId || 'N/A'}
            </td>
          </tr>
          <tr>
            <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
              Creation Time
            </th>
            <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
              {new Date(metric.creationTime).toLocaleString()}
            </td>
          </tr>
          {metric.deletionTime && (
            <tr>
              <th style={{ padding: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-background-tertiary)', fontWeight: 600 }}>
                Deletion Time
              </th>
              <td style={{ padding: '0.5rem', border: '1px solid var(--color-border)' }}>
                {new Date(metric.deletionTime).toLocaleString()}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link href={`/metric/${serviceId}/metric/${metric.id}/measurements`} passHref>
          <Button type="button">
            Measurements
          </Button>
        </Link>
        <Link href={`/metric/${serviceId}/metric/${metric.id}/aggregate`} passHref>
          <Button type="button">
            Aggregate
          </Button>
        </Link>
        {!isDeleted && (
          <Button
            type="button"
            onClick={handleDelete}
            color="#d32f2f"
          >
            Löschen
          </Button>
        )}
        {isDeleted && (
          <Button
            type="button"
            onClick={handleRestore}
            color="#388e3c"
          >
            Wiederherstellen
          </Button>
        )}
        <Link href={`/metric/${serviceId}/metric`} passHref>
          <Button type="button">
            Zurück zur Liste
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MetricDetail;
