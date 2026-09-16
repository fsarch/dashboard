'use client';

import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
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
import { useDebounce } from '@/utils/hooks/useDebounce.hook';
import { EServiceType } from '@/utils/configuration.type';
import { TCustomResourceCapableService, TCustomResourceDefinition } from '@/utils/app/custom-resources';
// Direkter Datei-Import (nicht über den Barrel index.ts) - diese Datei hat
// bewusst keine serverseitigen Imports und ist daher client-safe, im
// Gegensatz zu custom-resources.utils.ts (fetchService/getConfiguration).
import { getOpenReferencesForResource } from '@/utils/app/custom-resources/custom-resource-references.utils';
import {
  getCustomResourceInstanceAction,
  listCustomResourceCapableServicesAction,
  listCustomResourceInstancesAction,
  listCustomResourceTypesAction,
  searchCustomResourceInstancesAction,
} from './SelectCustomResourceDialog.server-action';
import inputStyles from '@/components/universals/forms/Input.module.scss';
import styles from './SelectCustomResourceDialog.module.scss';

export type TSelectCustomResourceDialogValue = {
  // Fest vorgegebener Service; wenn nicht gesetzt, zeigt der Dialog zuerst
  // eine Service-Auswahl (gefiltert auf supportsCustomResources, optional
  // weiter eingeschränkt durch appType).
  serviceId?: string;
  // Fest vorgegebener Custom-Resource-Typ; wenn nicht gesetzt, zeigt der
  // Dialog nach der Service-Auswahl eine Typ-Auswahl.
  resource?: TCustomResourceDefinition;
  // Alternative zu resource: nur die Definitions-ID - wird aufgelöst, sobald
  // types geladen ist. Spart dem Aufrufer, die Definition selbst vorab zu
  // laden (nützlich, wenn nur serviceId + resourceId bekannt sind, z. B. aus
  // einer statischen Formular-Konfiguration).
  resourceId?: string;
  // Schränkt die Service-Auswahl auf einen App-Typ ein (nur relevant, wenn
  // serviceId nicht gesetzt ist).
  appType?: EServiceType;
  // Bereits bekannte $system.crd-Referenzwerte (siehe
  // custom-resource-references.utils.ts), Key = Platzhalter-Text. Diese
  // werden vom Referenz-Auflösungs-Effekt übersprungen, statt sie über einen
  // Auswahlschritt abzufragen.
  refValues?: Record<string, string>;
};

// Resolved mit den rohen JSON-Daten des get-Aufrufs auf die ausgewählte
// Instanz (Form ist backend-/typ-abhängig, daher unknown).
type SelectCustomResourceDialogType = TDialogComponent<TSelectCustomResourceDialogValue, unknown>;

const DEFAULT_PAGE_SIZE = 20;

// Ein vorgeschalteter Auswahlschritt zur Auflösung einer offenen
// $system.crd-Referenz (siehe custom-resource-references.utils.ts): der
// Nutzer wählt eine Instanz von `resource`, deren id anschließend unter
// `placeholder` in refValues übernommen wird.
type TReferenceFrame = {
  resource: TCustomResourceDefinition;
  placeholder: string;
};

// Instanzen haben eine backend-/typ-abhängige, beliebige Form - als Label
// wird das name-Feld genutzt, mit Fallback auf id (Konvention wie bei
// Services/Typen in diesem Dialog). Exportiert, damit z. B.
// CustomResourcePickerInput denselben Label-Fallback nutzen kann.
export const getInstanceLabel = (instance: unknown): string => {
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
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput.trim(), 300);

  const [loading, setLoading] = useState(false);
  const [fetchingInstance, setFetchingInstance] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Aufgelöste $system.crd-Referenzen (Key = Platzhalter-Text, Wert = id der
  // gewählten Instanz) sowie der Stack noch offener Referenz-Auswahlschritte,
  // die vor der eigentlichen Instanz-Auswahl von resolvedResource durchlaufen
  // werden müssen (siehe custom-resource-references.utils.ts).
  const [refValues, setRefValues] = useState<Record<string, string>>(value.refValues ?? {});
  const [frameStack, setFrameStack] = useState<TReferenceFrame[]>([]);

  const step = !resolvedServiceId ? 'service' : !resolvedResource ? 'type' : 'instance';

  const isResolvingReference = frameStack.length > 0;
  const activeResource = isResolvingReference ? frameStack[frameStack.length - 1].resource : resolvedResource;

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

  // types wird nicht nur für den 'type'-Auswahlschritt geladen, sondern auch
  // gebraucht, um zu einer offenen $system.crd-Referenz (siehe
  // getOpenReferencesForResource) die referenzierte Definition
  // nachzuschlagen - daher unabhängig vom aktuellen step, sobald der Service
  // bekannt ist.
  useEffect(() => {
    if (!resolvedServiceId || types !== null) {
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
  }, [resolvedServiceId, types]);

  // Gibt es (ohne vorgegebene serviceId) nur einen Custom-Resource-fähigen
  // Service, muss der Nutzer den Auswahlschritt nicht durchlaufen - direkt
  // übernehmen.
  useEffect(() => {
    if (resolvedServiceId || services === null) {
      return;
    }
    if (services.length === 1) {
      setResolvedServiceId(services[0].id);
    }
  }, [resolvedServiceId, services]);

  // Solange dies zutrifft, löst der Effekt oben value.serviceId gleich noch
  // auf - der Service-Auswahlschritt soll währenddessen nicht (kurz mit der
  // einen Option) aufblitzen.
  const isAutoResolvingServiceId = !value.serviceId && services !== null && services.length === 1 && !resolvedServiceId;

  // Alternative zu einem vorgegebenen resource-Objekt: sobald types geladen
  // ist, resourceId dagegen auflösen (siehe TSelectCustomResourceDialogValue).
  useEffect(() => {
    if (resolvedResource || !value.resourceId || types === null) {
      return;
    }
    const match = types.find((type) => type.id === value.resourceId);
    if (!match) {
      setErrorMessage(`Custom Resource "${value.resourceId}" wurde nicht gefunden.`);
      return;
    }
    setResolvedResource(match);
  }, [resolvedResource, value.resourceId, types]);

  // Solange dies zutrifft, löst der Effekt oben value.resourceId gleich noch
  // auf - die Typ-Liste soll währenddessen nicht (kurz leer) aufblitzen.
  const isAutoResolvingResourceId = Boolean(value.resourceId) && !resolvedResource;

  // Sobald types geladen ist: prüfen, ob die aktuell aktive Resource (root
  // oder oberster Referenz-Frame) noch offene $system.crd-Referenzen hat, die
  // nicht in refValues vorhanden sind - falls ja, die referenzierte
  // Definition nachschlagen und als neuen Auswahlschritt auf den Stack legen.
  useEffect(() => {
    if (!resolvedServiceId || !resolvedResource || types === null) {
      return;
    }
    const currentResource = isResolvingReference ? frameStack[frameStack.length - 1].resource : resolvedResource;
    const openRefs = getOpenReferencesForResource(currentResource);
    const nextUnresolved = openRefs.find((ref) => !(ref.placeholder in refValues));
    if (!nextUnresolved) {
      return;
    }

    const referencedResource = types.find((type) => type.id === nextUnresolved.resourceId);
    if (!referencedResource) {
      setErrorMessage(`Referenzierte Custom Resource "${nextUnresolved.resourceId}" wurde nicht gefunden.`);
      return;
    }
    if (frameStack.some((frame) => frame.resource.id === referencedResource.id)) {
      setErrorMessage(`Zirkuläre Custom-Resource-Referenz auf "${referencedResource.id}" erkannt.`);
      return;
    }

    setFrameStack((stack) => [...stack, { resource: referencedResource, placeholder: nextUnresolved.placeholder }]);
    setInstances(null);
    setPage(1);
    setSearchInput('');
  }, [resolvedServiceId, resolvedResource, types, frameStack, isResolvingReference, refValues]);

  const canSearch = Boolean(activeResource?.apiRoutes.search);
  const isSearching = canSearch && debouncedSearch.length > 0;
  const canList = Boolean(activeResource?.apiRoutes.list);
  const activeEnablePagination = isSearching
    ? activeResource?.apiRoutes.search?.enablePagination
    : activeResource?.apiRoutes.list?.enablePagination;
  // Solange dies zutrifft, legt der Effekt oben gleich noch einen weiteren
  // Referenz-Auswahlschritt auf den Stack - die Liste soll dafür noch nicht
  // (kurz mit "keine Einträge") aufblitzen.
  const hasUnresolvedReferences = Boolean(activeResource) && types !== null
    && getOpenReferencesForResource(activeResource as TCustomResourceDefinition)
      .some((ref) => !(ref.placeholder in refValues));

  // Gibt es für eine aufzulösende $system.crd-Referenz (z. B. "nur ein
  // catalog") ohnehin nur eine Instanz, muss der Nutzer sie nicht manuell
  // auswählen - wie schon bei der Service-Auswahl automatisch übernehmen.
  // Nur auf der ersten, unabgesuchten Seite relevant, sonst könnte z. B. eine
  // Suche mit genau einem Treffer ungewollt sofort übernommen werden.
  const isAutoResolvingSingleReferenceInstance = isResolvingReference && !isSearching && page === 1
    && instances !== null && instances.length === 1 && !hasNextPage;

  // Bei Wechsel des Suchbegriffs auf Seite 1 zurückspringen, damit die
  // Pagination nicht auf einer nun ungültigen Seite hängen bleibt.
  useEffect(() => {
    setPage(1);
    setInstances(null);
  }, [debouncedSearch]);

  useEffect(() => {
    if (step !== 'instance' || !resolvedServiceId || !activeResource || types === null) {
      return;
    }
    // Solange die aktive Resource (root oder oberster Referenz-Frame) noch
    // offene $system.crd-Referenzen hat, noch nicht laden - der Effekt oben
    // legt im nächsten Tick den passenden Referenz-Auswahlschritt auf den
    // Stack.
    const stillOpen = getOpenReferencesForResource(activeResource).some((ref) => !(ref.placeholder in refValues));
    if (stillOpen) {
      return;
    }
    if (!isSearching && !canList) {
      // Kein List-Endpunkt und (noch) kein Suchbegriff - nichts zu laden.
      setInstances([]);
      setTotalItems(undefined);
      setHasNextPage(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const pagination = { skip: (page - 1) * pageSize, take: pageSize };
    const request = isSearching
      ? searchCustomResourceInstancesAction(resolvedServiceId, activeResource, debouncedSearch, pagination, refValues)
      : listCustomResourceInstancesAction(resolvedServiceId, activeResource, pagination, refValues);
    request
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
  }, [step, resolvedServiceId, activeResource, types, page, pageSize, isSearching, canList, debouncedSearch, refValues]);

  const handleSelectInstance = useCallback(async (instance: unknown) => {
    if (!resolvedServiceId || !activeResource) return;
    const instanceId = (instance as { id?: string } | null)?.id;
    if (!instanceId) return;

    if (isResolvingReference) {
      // Nur die id wird gebraucht, um den Platzhalter aufzulösen - kein
      // get-Aufruf auf die referenzierte Resource nötig.
      const frame = frameStack[frameStack.length - 1];
      setRefValues((prev) => ({ ...prev, [frame.placeholder]: instanceId }));
      setFrameStack((stack) => stack.slice(0, -1));
      setInstances(null);
      setPage(1);
      setSearchInput('');
      return;
    }

    setFetchingInstance(true);
    try {
      const data = await getCustomResourceInstanceAction(resolvedServiceId, activeResource, instanceId, refValues);
      onResult({ status: DialogResult.SUCCESS, value: data });
    } catch (error) {
      setErrorMessage(String(error));
    } finally {
      setFetchingInstance(false);
    }
  }, [resolvedServiceId, activeResource, isResolvingReference, frameStack, refValues, onResult]);

  useEffect(() => {
    if (!isAutoResolvingSingleReferenceInstance || !instances) {
      return;
    }
    handleSelectInstance(instances[0]);
    // handleSelectInstance setzt bei Erfolg u. a. instances zurück auf null,
    // wodurch isAutoResolvingSingleReferenceInstance im nächsten Render
    // wieder false wird - kein Risiko einer Endlosschleife.
  }, [isAutoResolvingSingleReferenceInstance, instances, handleSelectInstance]);

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

          {!errorMessage && (
            loading
            || isAutoResolvingServiceId
            || isAutoResolvingResourceId
            || (step === 'instance' && hasUnresolvedReferences)
            || isAutoResolvingSingleReferenceInstance
          ) && (
            <p className={styles.hint}>Lade …</p>
          )}

          {!errorMessage && !loading && step === 'service' && !isAutoResolvingServiceId && (
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

          {!errorMessage && !loading && step === 'type' && !isAutoResolvingResourceId && (
            <List className={styles.list}>
              {(types ?? []).map((type) => {
                const canSelectType = Boolean(type.apiRoutes.list || type.apiRoutes.search);
                return (
                  <div
                    key={type.id}
                    className={canSelectType ? styles.clickableRow : styles.disabledRow}
                    onClick={() => {
                      if (!canSelectType) return;
                      setResolvedResource(type);
                      setInstances(null);
                      setPage(1);
                      setSearchInput('');
                    }}
                  >
                    <ListItem>
                      <strong>{type.name}</strong>
                      {' '}
                      <span className={styles.subtle}>
                        [{type.id}] — {type.description}
                        {!canSelectType && ' (kein List- oder Search-Endpunkt)'}
                      </span>
                    </ListItem>
                  </div>
                );
              })}
              {types?.length === 0 && (
                <p className={styles.hint}>Keine Custom Resources vorhanden.</p>
              )}
            </List>
          )}

          {!errorMessage && step === 'instance' && resolvedResource && activeResource && !hasUnresolvedReferences
            && !isAutoResolvingSingleReferenceInstance && (
            <>
              {isResolvingReference && (
                <p className={styles.hint}>
                  Zuerst „{activeResource.name}“ auswählen (wird für „{resolvedResource.name}“ benötigt).
                </p>
              )}
              {canSearch && (
                <input
                  className={clsx(inputStyles.root, styles.searchInput)}
                  type="text"
                  placeholder="Suchen …"
                  aria-label="Custom-Resource-Instanzen durchsuchen"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              )}
              {fetchingInstance && <p className={styles.hint}>Lade Details …</p>}
              {!fetchingInstance && !loading && (
                <List className={styles.list}>
                  {(instances ?? []).map((instance, index) => {
                    const canSelect = Boolean((instance as { id?: string } | null)?.id)
                      && (isResolvingReference || activeResource.apiRoutes.get);
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
                    <p className={styles.hint}>
                      {!isSearching && !canList
                        ? 'Diese Custom Resource kann nur durchsucht werden - bitte Suchbegriff eingeben.'
                        : 'Keine Einträge gefunden.'}
                    </p>
                  )}
                </List>
              )}
              {activeEnablePagination && (
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
