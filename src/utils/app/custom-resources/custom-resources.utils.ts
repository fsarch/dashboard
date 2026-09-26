import { APPS } from '@/constants/apps';
import type { EServiceType } from '@/utils/configuration.type';
import { getConfiguration } from '@/utils/configuration.utils';
import { fetchService } from '@/utils/fetchService';
import type {
  TCustomResourceCapableService,
  TCustomResourceDefinition,
  TCustomResourceDefinitionWithAppType,
  TCustomResourceGetRoute,
  TCustomResourceInstanceListResult,
  TCustomResourceListResponseDto,
  TCustomResourceListRoute,
  TCustomResourceSearchRoute,
} from './custom-resources.type';

// Escaped Regex-Metazeichen in einem Variablennamen, damit dieser als
// literaler Textbaustein in ein RegExp-Pattern eingesetzt werden kann (siehe
// resolvePlaceholders) - wichtig für Namen wie "$system.crd.catalog.id", die
// mit "$" ein Regex-Metazeichen (End-Anker) enthalten.
const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ersetzt Platzhalter der Form {{name}} in path/queryParams-Werten - siehe
// @fsarch/server/custom-resource README (Placeholders): {{id}}, nur für
// search-Routen {{query}}, sowie {{$system.crd.<resourceId>.id}}-Verweise auf
// Instanzen anderer Custom-Resource-Typen (siehe
// custom-resource-references.utils.ts). Wird von diesem Modul selbst nicht
// ausgewertet, nur die hier bekannten Variablen werden aufgelöst.
const resolvePlaceholders = (
  value: string,
  vars: Record<string, string>,
): string =>
  Object.entries(vars).reduce(
    (resolved, [name, varValue]) =>
      resolved.replace(
        new RegExp(`\\{\\{\\s*${escapeRegExp(name)}\\s*\\}\\}`, 'g'),
        encodeURIComponent(varValue),
      ),
    value,
  );

// Flacht queryParams (Record<string, string | string[]>) zu Key/Value-Paaren
// ab - ein Array-Wert wird als wiederholter Query-Parameter gesendet
// (key=a&key=b), analog zur Server-Doku. Werte werden vorher wie path durch
// resolvePlaceholders aufgelöst.
const resolveQueryParams = (
  queryParams: Record<string, string | string[]> | undefined,
  vars: Record<string, string>,
): [string, string][] =>
  Object.entries(queryParams ?? {}).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map(
          (entry) =>
            [key, resolvePlaceholders(entry, vars)] as [string, string],
        )
      : [[key, resolvePlaceholders(value, vars)] as [string, string]],
  );

// Nicht-paginierte list/search-Routen (enablePagination: false, z. B. bei
// product-server) liefern laut Live-Check ein rohes Array statt des
// {data, metadata}-Pagination-Envelopes (siehe
// src/services/material-tracing/pagination.type.ts) - hier normalisiert, da
// dieses Modul beide Response-Formen unterstützen muss.
const normalizeInstanceListResponse = (
  body: unknown,
): TCustomResourceInstanceListResult => {
  if (Array.isArray(body)) {
    return {
      data: body,
      metadata: {
        currentPage: 1,
        pageSize: body.length,
        totalItems: body.length,
        totalPages: 1,
      },
    };
  }
  return body as TCustomResourceInstanceListResult;
};

const listCustomResources = async (
  serviceId: string,
): Promise<TCustomResourceDefinition[]> => {
  const response = await fetchService('/v1/.meta/custom-resources', undefined, {
    serviceId,
  });
  if (!response.ok) {
    throw new Error(`failed to list custom resources (${response.status})`);
  }

  const body: TCustomResourceListResponseDto = await response.json();
  return body.data;
};

// Es gibt keinen Backend-Endpunkt für ein einzelnes Element —
// daher: Liste holen und darin suchen.
const getCustomResourceById = async (
  serviceId: string,
  id: string,
): Promise<TCustomResourceDefinition | undefined> => {
  const resources = await listCustomResources(serviceId);
  return resources.find((resource) => resource.id === id);
};

// Listet Instanzen eines Custom-Resource-Typs über dessen list-Route.
// skip/take folgen der bestehenden Pagination dieses Backends (siehe
// src/services/material-tracing/pagination.type.ts); zusätzlich konfigurierte
// queryParams (z. B. ein fester Filter) werden übernommen. Manche list-Pfade
// enthalten {{$system.crd.<resourceId>.id}}-Verweise auf eine Instanz eines
// anderen Custom-Resource-Typs (siehe custom-resource-references.utils.ts) -
// deren aufgelöste Werte werden über refValues übergeben.
const list = async (
  serviceId: string,
  listRoute: TCustomResourceListRoute,
  options: { skip?: number; take?: number } = {},
  refValues: Record<string, string> = {},
): Promise<TCustomResourceInstanceListResult> => {
  const url = new URL(
    resolvePlaceholders(listRoute.request.path, refValues),
    'http://localhost',
  );
  resolveQueryParams(listRoute.request.queryParams, refValues).forEach(
    ([key, value]) => url.searchParams.append(key, value),
  );
  if (options.skip !== undefined) {
    url.searchParams.set('skip', String(options.skip));
  }
  if (options.take !== undefined) {
    url.searchParams.set('take', String(options.take));
  }

  const response = await fetchService(
    url.pathname + url.search,
    { method: listRoute.request.method },
    { serviceId },
  );
  if (!response.ok) {
    throw new Error(
      `failed to list custom resource instances (${response.status})`,
    );
  }

  return normalizeInstanceListResponse(await response.json());
};

// Ruft eine einzelne Instanz über die get-Route ab; {{id}} in path und
// queryParams wird durch die übergebene Instanz-ID ersetzt. Zusätzlich
// können offene $system.crd-Referenzen (siehe
// custom-resource-references.utils.ts) über refValues aufgelöst werden.
const get = async (
  serviceId: string,
  getRoute: TCustomResourceGetRoute,
  instanceId: string,
  refValues: Record<string, string> = {},
): Promise<unknown> => {
  const vars = { ...refValues, id: instanceId };
  const url = new URL(
    resolvePlaceholders(getRoute.request.path, vars),
    'http://localhost',
  );
  resolveQueryParams(getRoute.request.queryParams, vars).forEach(
    ([key, value]) => url.searchParams.append(key, value),
  );

  const response = await fetchService(
    url.pathname + url.search,
    { method: getRoute.request.method },
    { serviceId },
  );
  if (!response.ok) {
    throw new Error(
      `failed to get custom resource instance (${response.status})`,
    );
  }

  return response.json();
};

// Durchsucht Instanzen eines Custom-Resource-Typs über dessen search-Route;
// {{query}} in path und queryParams wird durch den Suchbegriff ersetzt (siehe
// @fsarch/server/custom-resource README, Placeholders). skip/take folgen wie
// bei list der bestehenden Pagination; refValues löst wie bei list/get
// offene $system.crd-Referenzen auf.
const search = async (
  serviceId: string,
  searchRoute: TCustomResourceSearchRoute,
  query: string,
  options: { skip?: number; take?: number } = {},
  refValues: Record<string, string> = {},
): Promise<TCustomResourceInstanceListResult> => {
  const vars = { ...refValues, query };
  const url = new URL(
    resolvePlaceholders(searchRoute.request.path, vars),
    'http://localhost',
  );
  resolveQueryParams(searchRoute.request.queryParams, vars).forEach(
    ([key, value]) => url.searchParams.append(key, value),
  );
  if (options.skip !== undefined) {
    url.searchParams.set('skip', String(options.skip));
  }
  if (options.take !== undefined) {
    url.searchParams.set('take', String(options.take));
  }

  const response = await fetchService(
    url.pathname + url.search,
    { method: searchRoute.request.method },
    { serviceId },
  );
  if (!response.ok) {
    throw new Error(
      `failed to search custom resource instances (${response.status})`,
    );
  }

  return normalizeInstanceListResponse(await response.json());
};

// Alle konfigurierten Services, deren App-Typ supportsCustomResources
// gesetzt hat, optional gefiltert auf einen bestimmten App-Typ.
const listCapableServices = async (
  appType?: EServiceType,
): Promise<TCustomResourceCapableService[]> => {
  const configuration = await getConfiguration();
  return configuration.services
    .filter((service) => APPS[service.type]?.supportsCustomResources)
    .filter((service) => !appType || service.type === appType)
    .map((service) => ({
      id: service.id,
      name: service.name,
      type: service.type,
    }));
};

// Ein Beispiel-Service pro unterstütztem App-Typ - dient als Repräsentant,
// über den die (laut Backend app-typ-weit identischen) Custom-Resource-
// Definitionen dieses Typs geladen werden können.
const listCapableAppTypes = async (): Promise<
  { appType: EServiceType; exampleServiceId: string }[]
> => {
  const services = await listCapableServices();
  const exampleServiceIdByType = new Map<EServiceType, string>();
  for (const service of services) {
    if (!exampleServiceIdByType.has(service.type)) {
      exampleServiceIdByType.set(service.type, service.id);
    }
  }
  return Array.from(exampleServiceIdByType.entries()).map(
    ([appType, exampleServiceId]) => ({
      appType,
      exampleServiceId,
    }),
  );
};

// Alle Custom-Resource-Definitionen über alle unterstützten App-Typen
// hinweg (service-übergreifende Übersicht). Ein nicht erreichbarer
// Beispiel-Service für einen App-Typ blendet nur dessen Definitionen aus,
// statt die gesamte Liste scheitern zu lassen.
const listAllCustomResourceDefinitions = async (): Promise<
  TCustomResourceDefinitionWithAppType[]
> => {
  const appTypes = await listCapableAppTypes();
  const definitionsByAppType = await Promise.all(
    appTypes.map(async ({ appType, exampleServiceId }) => {
      try {
        const resources = await listCustomResources(exampleServiceId);
        return resources.map((resource) => ({
          appType,
          exampleServiceId,
          resource,
        }));
      } catch {
        return [];
      }
    }),
  );
  return definitionsByAppType.flat();
};

// Eine einzelne Definition anhand von App-Typ + Resource-ID, für die
// service-übergreifende Detailseite im Development-Bereich.
const getCustomResourceDefinitionForAppType = async (
  appType: EServiceType,
  resourceId: string,
): Promise<TCustomResourceDefinitionWithAppType | undefined> => {
  const appTypes = await listCapableAppTypes();
  const match = appTypes.find((entry) => entry.appType === appType);
  if (!match) {
    return undefined;
  }

  const resource = await getCustomResourceById(
    match.exampleServiceId,
    resourceId,
  );
  if (!resource) {
    return undefined;
  }

  return { appType, exampleServiceId: match.exampleServiceId, resource };
};

export const customResourcesUtils = {
  listCustomResources,
  getCustomResourceById,
  listCapableServices,
  listCapableAppTypes,
  listAllCustomResourceDefinitions,
  getCustomResourceDefinitionForAppType,
  list,
  get,
  search,
};
