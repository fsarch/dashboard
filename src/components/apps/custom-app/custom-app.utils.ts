import { getServiceConfigurationById } from "@/utils/configuration.utils";
import { TConfiguration, type TCustomAppConfiguration } from "@/utils/configuration.type";
import * as yaml from "js-yaml";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { TCustomAppConfig } from "@/components/apps/custom-app/custom-app.type";
import { TGeneratedFormDataSource } from "@/components/universals/forms/generated/GeneratedForm.type";
import { fetchService } from "@/utils/fetchService";
import jsonata from "jsonata";
import { fetchCustom } from "@/utils/fetchCustom";

let configuration: TCustomAppConfig | null = null;

async function loadCustomAppConfigByPath(path: string): Promise<TCustomAppConfig> {
  if (!configuration) {
    const indexPath = resolve(process.cwd(), dirname(process.env.CONFIG_FILE_PATH ?? '.'), path);
    console.log(indexPath);
    configuration = yaml.load(
      await readFile(indexPath, 'utf8'),
    ) as TCustomAppConfig;
  }

  return configuration;
}

async function getCustomAppConfig(customAppId: string): Promise<TCustomAppConfig | null> {
  const config = await getServiceConfigurationById(customAppId) as TCustomAppConfiguration | null;
  if (!config) {
    return null;
  }

  const customConfig = await loadCustomAppConfigByPath(config.path);

  return customConfig;
}

async function evaluateDatasource(
  dataSource: TGeneratedFormDataSource,
  options: { context: Record<string, unknown>; baseUrl: string; },
): Promise<unknown> {
  const url = new URL(dataSource.path, options.baseUrl);
  const dataResponse = await fetchCustom(url.toString(), {
    method: dataSource.method,
    headers: dataSource.headers,
  });
  const rawData = await dataResponse.json();

  const transformedResponse = await (jsonata(dataSource.transformResponse.value).evaluate({
    body: rawData,
  }));

  return transformedResponse.body;
}

async function evaluateDatasources(
  dataSources: Record<string, TGeneratedFormDataSource>,
  options: { context: Record<string, unknown>; baseUrl: string; } = { context: {}, baseUrl: '' },
) {
  const entries = await Promise.all(Object.entries(dataSources ?? {}).map(async ([key, value]) => {
    const newValue = await evaluateDatasource(value, options);

    return [key, newValue];
  }));

  return Object.fromEntries(entries);
}

export const customAppUtils = {
  getCustomAppConfig,
  evaluateDatasources,
  evaluateDatasource,
};
