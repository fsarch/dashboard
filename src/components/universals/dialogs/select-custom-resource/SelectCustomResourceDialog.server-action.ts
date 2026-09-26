'use server';

import {
  customResourceLinksUtils,
  customResourcesUtils,
  type TCustomResourceDefinition,
} from '@/utils/app/custom-resources';
import type { EServiceType } from '@/utils/configuration.type';

export const listCustomResourceCapableServicesAction = async (
  appType?: EServiceType,
) => customResourcesUtils.listCapableServices(appType);

export const listCustomResourceTypesAction = async (serviceId: string) =>
  customResourcesUtils.listCustomResources(serviceId);

export const listCustomResourceInstancesAction = async (
  serviceId: string,
  resource: TCustomResourceDefinition,
  options: { skip?: number; take?: number },
  refValues: Record<string, string> = {},
) => {
  if (!resource.apiRoutes.list) {
    throw new Error('this custom resource type has no list route');
  }
  return customResourcesUtils.list(
    serviceId,
    resource.apiRoutes.list,
    options,
    refValues,
  );
};

export const getCustomResourceInstanceAction = async (
  serviceId: string,
  resource: TCustomResourceDefinition,
  instanceId: string,
  refValues: Record<string, string> = {},
) => {
  if (!resource.apiRoutes.get) {
    throw new Error('this custom resource type has no get route');
  }
  return customResourcesUtils.get(
    serviceId,
    resource.apiRoutes.get,
    instanceId,
    refValues,
  );
};

// Wie getCustomResourceInstanceAction, aber für Aufrufer, die nur die
// resourceId kennen (nicht die vollständige Definition) - z. B.
// CustomResourcePickerInput, das für ein GeneratedForm-Feld nur
// serviceId/resourceId/refValues aus der Formular-Konfiguration hat.
export const getCustomResourceInstanceByIdAction = async (
  serviceId: string,
  resourceId: string,
  instanceId: string,
  refValues: Record<string, string> = {},
) => {
  const resource = await customResourcesUtils.getCustomResourceById(
    serviceId,
    resourceId,
  );
  if (!resource) {
    throw new Error(`custom resource "${resourceId}" not found`);
  }
  if (!resource.apiRoutes.get) {
    throw new Error('this custom resource type has no get route');
  }
  return customResourcesUtils.get(
    serviceId,
    resource.apiRoutes.get,
    instanceId,
    refValues,
  );
};

// Für den "Rücksprung"-Chevron (CustomResourcePickerInput): liefert den Link
// zur Detailseite der Instanz, sofern eine App-Route resourceId per
// providesCustomResource als bereitgestellt markiert hat (siehe
// custom-resource-links.utils.ts) - sonst undefined, wenn keine
// entsprechende Route registriert ist.
export const getCustomResourceLinkHrefAction = async (
  serviceId: string,
  resourceId: string,
  instance: unknown,
  refValues: Record<string, string> = {},
) =>
  customResourceLinksUtils.buildHref(
    serviceId,
    resourceId,
    instance,
    refValues,
  );

export const searchCustomResourceInstancesAction = async (
  serviceId: string,
  resource: TCustomResourceDefinition,
  query: string,
  options: { skip?: number; take?: number },
  refValues: Record<string, string> = {},
) => {
  if (!resource.apiRoutes.search) {
    throw new Error('this custom resource type has no search route');
  }
  return customResourcesUtils.search(
    serviceId,
    resource.apiRoutes.search,
    query,
    options,
    refValues,
  );
};
