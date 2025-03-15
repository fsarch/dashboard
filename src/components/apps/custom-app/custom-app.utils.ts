import { getCurrentServiceConfiguration, getServiceConfigurationById } from "@/utils/configuration.utils";
import { EServiceType, type TCustomAppConfiguration } from "@/utils/configuration.type";
import * as yaml from "js-yaml";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  TCustomAppClickHandler,
  TCustomAppClickHandlerFunc,
  TCustomAppConfig
} from "@/components/apps/custom-app/custom-app.type";
import {
  TGeneratedFormDataSource,
  TJsonataExpression
} from "@/components/universals/forms/generated/GeneratedForm.type";
import jsonata from "jsonata";
import { fetchCustom } from "@/utils/fetchCustom";
import { headers } from "next/headers";

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

async function createClickAction(handler: TCustomAppClickHandler): Promise<TCustomAppClickHandlerFunc> {
  return async (data) => {
    'use server';

    const service = await getCurrentServiceConfiguration(EServiceType.CUSTOM_APP);

    if (handler.$type === 'fetch') {
      const url = typeof handler.path === 'string'
        ? handler.path
        : await jsonata(handler.path.value).evaluate({
          query: data.query,
          service: {
            baseUrl: service.url,
          },
        });

      await fetchCustom(url.toString(), {
        method: handler.method,
        headers: handler.headers,
      });

      return null;
    }

    console.log('test');

    return null;
  };
}

export const createEvaluableExpression = (expression: string | TJsonataExpression) => {
  if (typeof expression === 'string') {
    return async () => expression;
  }

  const jsonataExpression = jsonata(expression.value);

  return async (additionalInput: Record<string, unknown>) => {
    const urlString = (await headers()).get('x-original-url');
    let query;

    if (urlString) {
      try {
        const url = new URL(urlString);
        query = Object.fromEntries(url.searchParams.entries());
      } catch {
        // ignore
      }
    }

    return jsonataExpression.evaluate({
      query,
      ...additionalInput,
    });
  };
};

export const customAppUtils = {
  getCustomAppConfig,
  evaluateDatasources,
  evaluateDatasource,
  createClickAction,
  createEvaluableExpression,
};
