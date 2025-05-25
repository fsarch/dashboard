import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import * as yaml from 'js-yaml';

import {
  EServiceType,
  TConfiguration,
  TServiceConfiguration
} from "@/utils/configuration.type";
import { headers } from "next/headers";
import { PageNotFoundError } from "next/dist/shared/lib/utils";
import { ServerLogger } from "@/utils/ServerLogger";

const YAML_CONFIG_FILENAME = 'config.yml'

let configuration: TConfiguration;

export async function getConfiguration(): Promise<TConfiguration> {
  if (!configuration) {
    configuration = yaml.load(
      await readFile(resolve(process.cwd(), process.env.CONFIG_FILE_PATH || YAML_CONFIG_FILENAME), 'utf8'),
    ) as TConfiguration;
  }

  return configuration;
}

export async function getServiceConfiguration<T extends EServiceType>(type: T): Promise<(TServiceConfiguration & { type: T }) | undefined> {
  return (await getConfiguration()).services.find((s) => s.type === type) as (TServiceConfiguration & { type: T }) | undefined;
}

export async function getServiceConfigurations<T extends EServiceType>(type: T): Promise<Array<TServiceConfiguration & { type: T }>> {
  return (await getConfiguration()).services.filter((s) => s.type === type) as Array<TServiceConfiguration & { type: T }>;
}


export async function getServiceConfigurationById(id: string): Promise<TServiceConfiguration | undefined> {
  return (await getConfiguration()).services.find((s) => s.id === id);
}

export async function getCurrentServiceId(): Promise<string> {
  return (await headers()).get('X-Service-Id')!;
}

export async function getCurrentServiceType(): Promise<EServiceType> {
  return (await headers()).get('X-Service-Type') as EServiceType;
}

export async function getDefaultServiceId(serviceType: EServiceType): Promise<string> {
  const defaultId = (await getConfiguration()).defaults[serviceType]?.id;
  if (!defaultId) {
    throw new Error('non-configured default service');
  }

  return defaultId;
}

export async function getCurrentServiceBaseConfiguration(): Promise<TServiceConfiguration> {
  const serviceId = (await headers()).get('X-Service-Id');

  const foundServiceType = (await getConfiguration()).services.find((s) => s.id === serviceId);

  if (!foundServiceType) {
    ServerLogger.Instance.debug(`could not get service configuration for {id}`, {
      serviceId,
    });
    throw new PageNotFoundError('service configuration not found');
  }

  return foundServiceType;
}

export async function getCurrentServiceConfiguration<T extends EServiceType>(type: T): Promise<TServiceConfiguration & { type: T }> {
  const foundServiceType = await getCurrentServiceBaseConfiguration();

  if (foundServiceType.type !== type) {
    ServerLogger.Instance.debug(`could not get service configuration for {type}`, {
      type,
      foundServiceType,
    });
    throw new PageNotFoundError('service configuration not found');
  }

  return foundServiceType as TServiceConfiguration & { type: T };
}
