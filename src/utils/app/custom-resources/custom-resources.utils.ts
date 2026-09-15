import { fetchService } from '@/utils/fetchService';
import { getConfiguration } from '@/utils/configuration.utils';
import { APPS } from '@/constants/apps';
import { EServiceType } from '@/utils/configuration.type';
import {
  TCustomResourceCapableService,
  TCustomResourceDefinition,
  TCustomResourceDefinitionWithAppType,
  TCustomResourceGetRoute,
  TCustomResourceInstanceListResult,
  TCustomResourceListResponseDto,
  TCustomResourceListRoute,
} from './custom-resources.type';

const listCustomResources = async (serviceId: string): Promise<TCustomResourceDefinition[]> => {
  const response = await fetchService('/v1/.meta/custom-resources', undefined, { serviceId });
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
// Query-Parameter/Antwortformat folgen der bestehenden skip/take-Pagination
// dieses Backends (siehe src/services/material-tracing/pagination.type.ts) -
// list-Pfade enthalten laut Backend-Registrierung nie Platzhalter.
const list = async (
  serviceId: string,
  listRoute: TCustomResourceListRoute,
  options: { skip?: number; take?: number } = {},
): Promise<TCustomResourceInstanceListResult> => {
  const url = new URL(listRoute.request.path, 'http://localhost');
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
    throw new Error(`failed to list custom resource instances (${response.status})`);
  }

  return response.json();
};

// Ruft eine einzelne Instanz über die get-Route ab; {{id}} wird durch die
// übergebene Instanz-ID ersetzt (get-Routen haben laut Backend-Registrierung
// genau einen solchen Platzhalter, z. B. /v1/parts/{{id}}).
const get = async (
  serviceId: string,
  getRoute: TCustomResourceGetRoute,
  instanceId: string,
): Promise<unknown> => {
  const resolvedPath = getRoute.request.path.replace(/\{\{\s*id\s*\}\}/g, encodeURIComponent(instanceId));

  const response = await fetchService(
    resolvedPath,
    { method: getRoute.request.method },
    { serviceId },
  );
  if (!response.ok) {
    throw new Error(`failed to get custom resource instance (${response.status})`);
  }

  return response.json();
};

// Alle konfigurierten Services, deren App-Typ supportsCustomResources
// gesetzt hat, optional gefiltert auf einen bestimmten App-Typ.
const listCapableServices = async (appType?: EServiceType): Promise<TCustomResourceCapableService[]> => {
  const configuration = await getConfiguration();
  return configuration.services
    .filter((service) => APPS[service.type]?.supportsCustomResources)
    .filter((service) => !appType || service.type === appType)
    .map((service) => ({ id: service.id, name: service.name, type: service.type }));
};

// Ein Beispiel-Service pro unterstütztem App-Typ - dient als Repräsentant,
// über den die (laut Backend app-typ-weit identischen) Custom-Resource-
// Definitionen dieses Typs geladen werden können.
const listCapableAppTypes = async (): Promise<{ appType: EServiceType; exampleServiceId: string }[]> => {
  const services = await listCapableServices();
  const exampleServiceIdByType = new Map<EServiceType, string>();
  for (const service of services) {
    if (!exampleServiceIdByType.has(service.type)) {
      exampleServiceIdByType.set(service.type, service.id);
    }
  }
  return Array.from(exampleServiceIdByType.entries()).map(([appType, exampleServiceId]) => ({
    appType,
    exampleServiceId,
  }));
};

// Alle Custom-Resource-Definitionen über alle unterstützten App-Typen
// hinweg (service-übergreifende Übersicht). Ein nicht erreichbarer
// Beispiel-Service für einen App-Typ blendet nur dessen Definitionen aus,
// statt die gesamte Liste scheitern zu lassen.
const listAllCustomResourceDefinitions = async (): Promise<TCustomResourceDefinitionWithAppType[]> => {
  const appTypes = await listCapableAppTypes();
  const definitionsByAppType = await Promise.all(
    appTypes.map(async ({ appType, exampleServiceId }) => {
      try {
        const resources = await listCustomResources(exampleServiceId);
        return resources.map((resource) => ({ appType, exampleServiceId, resource }));
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

  const resource = await getCustomResourceById(match.exampleServiceId, resourceId);
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
};
