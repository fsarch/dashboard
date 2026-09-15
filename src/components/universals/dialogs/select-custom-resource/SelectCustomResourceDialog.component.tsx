'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { TDialogComponent } from '@/components/universals/dialog/dialog.type';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import Dialog from '@/components/universals/dialog/dialog.component';
import DialogTitle from '@/components/universals/dialog/DialogTitle.component';
import DialogContent from '@/components/universals/dialog/DialogContent.component';
import DialogButtons from '@/components/universals/dialog/DialogButtons.component';
import Button from '@/components/universals/forms/Button';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Pagination from '@/components/universals/pagination/Pagination.component';
import { EServiceType } from '@/utils/configuration.type';
import { TCustomResourceCapableService, TCustomResourceDefinition } from '@/utils/app/custom-resources';
import {
  getCustomResourceInstanceAction,
  listCustomResourceCapableServicesAction,
  listCustomResourceInstancesAction,
  listCustomResourceTypesAction,
} from './SelectCustomResourceDialog.server-action';
import styles from './SelectCustomResourceDialog.module.scss';

export type TSelectCustomResourceDialogValue = {
  // Fest vorgegebener Service; wenn nicht gesetzt, zeigt der Dialog zuerst
  // eine Service-Auswahl (gefiltert auf supportsCustomResources, optional
  // weiter eingeschränkt durch appType).
  serviceId?: string;
  // Fest vorgegebener Custom-Resource-Typ; wenn nicht gesetzt, zeigt der
  // Dialog nach der Service-Auswahl eine Typ-Auswahl.
  resource?: TCustomResourceDefinition;
  // Schränkt die Service-Auswahl auf einen App-Typ ein (nur relevant, wenn
  // serviceId nicht gesetzt ist).
  appType?: EServiceType;
};

// Resolved mit den rohen JSON-Daten des get-Aufrufs auf die ausgewählte
// Instanz (Form ist backend-/typ-abhängig, daher unknown).
type SelectCustomResourceDialogType = TDialogComponent<TSelectCustomResourceDialogValue, unknown>;

const DEFAULT_PAGE_SIZE = 20;

// Instanzen haben eine backend-/typ-abhängige, beliebige Form - als Label
// wird das name-Feld genutzt, mit Fallback auf id (Konvention wie bei
// Services/Typen in diesem Dialog).
const getInstanceLabel = (instance: unknown): string => {
  const record = instance as { name?: unknown; id?: unknown } | null;
  if (record && typeof record.name === 'string' && record.name) {
    return record.name;
  }
  if (record && typeof record.id === 'string' && record.id) {
    return record.id;
  }
  return '(ohne Name/ID)';
};

const SelectCustomResourceDialog: SelectCustomResourceDialogType = ({ value, onResult }) => {
  const [resolvedServiceId, setResolvedServiceId] = useState(value.serviceId);
  const [resolvedResource, setResolvedResource] = useState(value.resource);

  const [services, setServices] = useState<TCustomResourceCapableService[] | null>(null);
  const [types, setTypes] = useState<TCustomResourceDefinition[] | null>(null);
  const [instances, setInstances] = useState<unknown[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState<number | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchingInstance, setFetchingInstance] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const step = !resolvedServiceId ? 'service' : !resolvedResource ? 'type' : 'instance';

  useEffect(() => {
    if (step !== 'service' || services !== null) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    listCustomResourceCapableServicesAction(value.appType)
      .then((result) => {
        if (!cancelled) setServices(result);
      })
      .catch((error) => {
        if (!cancelled) setErrorMessage(String(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, services, value.appType]);

  useEffect(() => {
    if (step !== 'type' || !resolvedServiceId || types !== null) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    listCustomResourceTypesAction(resolvedServiceId)
      .then((result) => {
        if (!cancelled) setTypes(result);
      })
      .catch((error) => {
        if (!cancelled) setErrorMessage(String(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, resolvedServiceId, types]);

  useEffect(() => {
    if (step !== 'instance' || !resolvedServiceId || !resolvedResource) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    listCustomResourceInstancesAction(resolvedServiceId, resolvedResource, {
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
      .then((result) => {
        if (cancelled) return;
        setInstances(result.data);
        setTotalItems(result.metadata?.totalItems);
        setHasNextPage(
          result.metadata?.totalItems !== undefined
            ? page * pageSize < result.metadata.totalItems
            : result.data.length === pageSize,
        );
      })
      .catch((error) => {
        if (!cancelled) setErrorMessage(String(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, resolvedServiceId, resolvedResource, page, pageSize]);

  const handleSelectInstance = useCallback(async (instance: unknown) => {
    if (!resolvedServiceId || !resolvedResource) return;
    const instanceId = (instance as { id?: string } | null)?.id;
    if (!instanceId) return;

    setFetchingInstance(true);
    try {
      const data = await getCustomResourceInstanceAction(resolvedServiceId, resolvedResource, instanceId);
      onResult({ status: DialogResult.SUCCESS, value: data });
    } catch (error) {
      setErrorMessage(String(error));
    } finally {
      setFetchingInstance(false);
    }
  }, [resolvedServiceId, resolvedResource, onResult]);

  const handlePageSizeChange = useCallback((nextPageSize: number) => {
    setPage(1);
    setPageSize(nextPageSize);
    setInstances(null);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    setInstances(null);
  }, []);

  return (
    <Dialog>
      <div className={styles.root}>
        <DialogTitle>Custom-Resource-Instanz auswählen</DialogTitle>

        <DialogContent enableBottomPadding={false}>
          {errorMessage && (
            <p className={styles.error}>{errorMessage}</p>
          )}

          {!errorMessage && loading && (
            <p className={styles.hint}>Lade …</p>
          )}

          {!errorMessage && !loading && step === 'service' && (
            <List className={styles.list}>
              {(services ?? []).map((service) => (
                <div
                  key={service.id}
                  className={styles.clickableRow}
                  onClick={() => {
                    setResolvedServiceId(service.id);
                    setTypes(null);
                  }}
                >
                  <ListItem>
                    <strong>{service.name ?? service.id}</strong>
                    {' '}
                    <span className={styles.subtle}>[{service.type}] — {service.id}</span>
                  </ListItem>
                </div>
              ))}
              {services?.length === 0 && (
                <p className={styles.hint}>Keine Services mit Custom-Resource-Unterstützung gefunden.</p>
              )}
            </List>
          )}

          {!errorMessage && !loading && step === 'type' && (
            <List className={styles.list}>
              {(types ?? []).map((type) => (
                <div
                  key={type.id}
                  className={type.apiRoutes.list ? styles.clickableRow : styles.disabledRow}
                  onClick={() => {
                    if (!type.apiRoutes.list) return;
                    setResolvedResource(type);
                    setInstances(null);
                    setPage(1);
                  }}
                >
                  <ListItem>
                    <strong>{type.name}</strong>
                    {' '}
                    <span className={styles.subtle}>
                      [{type.id}] — {type.description}
                      {!type.apiRoutes.list && ' (kein List-Endpunkt)'}
                    </span>
                  </ListItem>
                </div>
              ))}
              {types?.length === 0 && (
                <p className={styles.hint}>Keine Custom Resources vorhanden.</p>
              )}
            </List>
          )}

          {!errorMessage && step === 'instance' && resolvedResource && (
            <>
              {fetchingInstance && <p className={styles.hint}>Lade Details …</p>}
              {!fetchingInstance && !loading && (
                <List className={styles.list}>
                  {(instances ?? []).map((instance, index) => {
                    const canSelect = Boolean((instance as { id?: string } | null)?.id) && resolvedResource.apiRoutes.get;
                    return (
                      <div
                        key={index}
                        className={canSelect ? styles.clickableRow : styles.disabledRow}
                        onClick={() => canSelect && handleSelectInstance(instance)}
                      >
                        <ListItem>
                          <strong className={styles.instanceLabel}>{getInstanceLabel(instance)}</strong>
                        </ListItem>
                      </div>
                    );
                  })}
                  {instances?.length === 0 && (
                    <p className={styles.hint}>Keine Einträge gefunden.</p>
                  )}
                </List>
              )}
              {resolvedResource.apiRoutes.list?.enablePagination && (
                <div className={styles.paginationWrapper}>
                  <Pagination
                    currentPage={page}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    hasNextPage={hasNextPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </DialogContent>

        <DialogButtons alignment="center">
          <Button type="button" onClick={() => onResult({ status: DialogResult.CANCEL })}>
            Abbrechen
          </Button>
        </DialogButtons>
      </div>
    </Dialog>
  );
};

export default SelectCustomResourceDialog;
