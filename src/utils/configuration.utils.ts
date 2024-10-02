import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import * as yaml from 'js-yaml';

import {
  EServiceType,
  TConfiguration,
  TServiceConfiguration
} from "@/utils/configuration.type";

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


export async function getServiceConfigurationById(id: string): Promise<TServiceConfiguration | undefined> {
  return (await getConfiguration()).services.find((s) => s.id === id);
}
