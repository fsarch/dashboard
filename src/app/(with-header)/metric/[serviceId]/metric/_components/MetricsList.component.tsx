'use client';

import React from 'react';
import { TPaginationResultDto, TMetricDto } from '@/services/metric/metric.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import { deleteMetricAction, restoreMetricAction } from './MetricActions.server-action';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import AlertDialog from '@/components/universals/dialogs/alert/AlertDialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';

type MetricsListProps = {
  metrics: TPaginationResultDto<TMetricDto>;
  serviceId: string;
  metricTypeId?: string;
  page: number;
  pageSize: number;
  isDeleted?: boolean;
};

const MetricsList: React.FunctionComponent<MetricsListProps> = ({
  metrics,
  serviceId,
  metricTypeId,
  page,
  pageSize,
  isDeleted = false,
}) => {
  const { data, metadata } = metrics;
  const router = useRouter();
  const openDialog = useOpenDialog();

  const handleDelete = async (metricId: string, metricName: string) => {
    const dialogResult = await openDialog(AlertDialog, {
      text: `Sind Sie sicher, dass Sie die Metrik "${metricName}" löschen möchten?`,
      buttonText: 'Löschen',
      buttonColor: '#d32f2f',
    }).result;

    if (dialogResult.status === DialogResult.SUCCESS) {
      try {
        await deleteMetricAction(serviceId, metricId);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Löschen der Metrik: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
      }
    }
  };

  const handleRestore = async (metricId: string, metricName: string) => {
    const dialogResult = await openDialog(AlertDialog, {
      text: `Sind Sie sicher, dass Sie die Metrik "${metricName}" wiederherstellen möchten?`,
      buttonText: 'Wiederherstellen',
    }).result;

    if (dialogResult.status === DialogResult.SUCCESS) {
      try {
        await restoreMetricAction(serviceId, metricId);
        router.refresh();
      } catch (error) {
        await openDialog(AlertDialog, {
          text: `Fehler beim Wiederherstellen der Metrik: ${error instanceof Error ? error.message : String(error)}`,
          buttonText: 'OK',
        });
      }
    }
  };

  const metricTypeIdParam = metricTypeId ? `&metricTypeId=${metricTypeId}` : '';

  const handlePageChange = (newPage: number) => {
    router.push(`/metric/${serviceId}/metric?page=${newPage}&pageSize=${pageSize}${metricTypeIdParam}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/metric/${serviceId}/metric?page=1&pageSize=${newPageSize}${metricTypeIdParam}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href={`/metric/${serviceId}/metric/create${metricTypeId ? `?metricTypeId=${metricTypeId}` : ''}`} passHref>
          <Button type="button">
            Create Metric
          </Button>
        </Link>
      </div>
      {data.length > 0 ? (
        <>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
            <List>
              {data.map((metric) => {
                const isMetricDeleted = metric.deletionTime !== null;
                return (
                  <div key={metric.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link
                      href={`/metric/${serviceId}/metric/${metric.id}`}
                      style={{ flex: 1, textDecoration: isMetricDeleted ? 'line-through' : 'none', opacity: isMetricDeleted ? 0.6 : 1 }}
                    >
                      <ListItem>
                        <strong>{metric.name}</strong> - ID: {metric.id}
                        <br />
                        <small>
                          Type: {metric.metricTypeId} |
                          Ext-ID: {metric.externalId || 'N/A'} |
                          Created: {new Date(metric.creationTime).toLocaleString()}
                          {metric.deletionTime && (
                            <>
                              <br />
                              Deleted: {new Date(metric.deletionTime).toLocaleString()}
                            </>
                          )}
                        </small>
                      </ListItem>
                    </Link>
                    {!isDeleted && (
                      <div style={{ flexShrink: 0 }}>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(metric.id, metric.name);
                          }}
                          color="#d32f2f"
                        >
                          Löschen
                        </Button>
                      </div>
                    )}
                    {isDeleted && (
                      <div style={{ flexShrink: 0 }}>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRestore(metric.id, metric.name);
                          }}
                          color="#388e3c"
                        >
                          Wiederherstellen
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </List>
          </div>
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={metadata.totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            hasNextPage={page < metadata.totalPages}
          />
        </>
      ) : (
        <p>Keine Metrics gefunden.</p>
      )}
    </div>
  );
};

export default MetricsList;
