'use server';

import { customResourcesUtils, TCustomResourceDefinition } from '@/utils/app/custom-resources';
import { EServiceType } from '@/utils/configuration.type';

export const listCustomResourceCapableServicesAction = async (appType?: EServiceType) => customResourcesUtils.listCapableServices(appType);

export const listCustomResourceTypesAction = async (serviceId: string) => customResourcesUtils.listCustomResources(serviceId);

export const listCustomResourceInstancesAction = async (
  serviceId: string,
  resource: TCustomResourceDefinition,
  options: { skip?: number; take?: number },
) => {
  if (!resource.apiRoutes.list) {
    throw new Error('this custom resource type has no list route');
  }
  return customResourcesUtils.list(serviceId, resource.apiRoutes.list, options);
};

export const getCustomResourceInstanceAction = async (
  serviceId: string,
  resource: TCustomResourceDefinition,
  instanceId: string,
) => {
  if (!resource.apiRoutes.get) {
    throw new Error('this custom resource type has no get route');
  }
  return customResourcesUtils.get(serviceId, resource.apiRoutes.get, instanceId);
};
