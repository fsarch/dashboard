import { getCurrentServiceConfiguration, getServiceConfigurationById } from "@/utils/configuration.utils";
import { EServiceType, type TCustomAppConfiguration } from "@/utils/configuration.type";
import * as yaml from "js-yaml";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  TCustomAppClickHandler,
  TCustomAppClickHandlerFunc,
  TCustomAppConfig, TFormView, TSectionView,
} from "@/components/apps/custom-app/custom-app.type";
import {
  TGeneratedFormDataSource,
  TGeneratedFormSelectInput,
  TGeneratedFormTextInput,
  TGeneratedNestedForm,
  TJsonataExpression
} from "@/components/universals/forms/generated/GeneratedForm.type";
import jsonata from "jsonata";
import { fetchCustom } from "@/utils/fetchCustom";
import { headers } from "next/headers";
import Joi from "joi";
import { jsonataUtils } from "@/components/apps/custom-app/jsonata.utils";
import { AppNavigation, AppNavigationItem } from "@/constants/app.type";

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

  await validateCustomAppConfig(customConfig)

  return customConfig;
}

const CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA = Joi.object({
  $type: Joi.string().valid('jsonata').required(),
  value: Joi.string().required(),
});

const CUSTOM_APP_CONSTANT_STRING_EXPRESSION_SCHEMA = Joi.object({
  $type: Joi.string().valid('constant').required(),
  value: Joi.string().required(),
});

const CUSTOM_APP_FORM_DATA_SOURCE_SCHEMA = Joi.alternatives(
  Joi.object({
    $type: Joi.string().allow('fetch').required(),
    path: Joi.alternatives(
      Joi.string().required(),
      CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA.required(),
    ).required(),
    method: Joi.string().allow('GET', 'POST', 'PUT', 'PATCH', 'DELETE').required(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()),
    transformResponse: CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA,
  })
);

const CUSTOM_APP_GENERATED_FORM_ENDPOINT_PROPERTIES = {
  path: Joi.alternatives(
    Joi.string().required(),
    CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA.required(),
  ).required(),
  method: Joi.string().allow('GET', 'POST', 'PUT', 'PATCH', 'DELETE').required(),
  headers: Joi.object().pattern(Joi.string(), Joi.string().required()),
  body: Joi.alternatives(
    Joi.string().required(),
      CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA.required(),
  ),
};

const CUSTOM_APP_GENERATED_FORM_ENDPOINT_SCHEMA = Joi.object(CUSTOM_APP_GENERATED_FORM_ENDPOINT_PROPERTIES);

const CUSTOM_APP_CLICK_HANDLER_SCHEMA = Joi.alternatives(
  Joi.object({
    $type: Joi.string().allow('open-service-view').required(),
    path: CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA.required(),
    }),
  Joi.object({
    $type: Joi.string().allow('fetch').required(),
    ...CUSTOM_APP_GENERATED_FORM_ENDPOINT_PROPERTIES,
    }),
  );

const CUSTOM_APP_DATA_SCHEMA = Joi.alternatives(
  Joi.object({
    $type: Joi.string().allow('datasource').required(),
    value: Joi.string().required(),
    }),
  Joi.object({
    $type: Joi.string().allow('constant').required(),
    value: Joi.any().required(),
    }),
  );

const FORM_LIST_VIEW_PROPERTIES = {
  $type: Joi.string().allow('list').required(),
  click: CUSTOM_APP_CLICK_HANDLER_SCHEMA.required(),
  data: CUSTOM_APP_DATA_SCHEMA.required(),
};

const FORM_BUTTON_VIEW_SCHEMA = Joi.object({
  $type: Joi.string().allow('button').required(),
  label: Joi.string().required(),
  click: CUSTOM_APP_CLICK_HANDLER_SCHEMA.required(),
});

const FORM_IFRAME_VIEW_SCHEMA = Joi.object({
  $type: Joi.string().allow('iframe').required(),
  url: Joi.alternatives(
    Joi.string().required(),
    CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA.required(),
  ).required(),
});

const FORM_BASE_INPUT_PROPERTIES = {
  id: Joi.string().required(),
  label: Joi.string().required(),
};

const FORM_NESTED_FORM_VIEW_SCHEMA = Joi.object<TGeneratedNestedForm>({
  ...FORM_BASE_INPUT_PROPERTIES,
  $type: Joi.string().allow('nested-form').required(),
  isArray: Joi.bool(),
  addInitialValues: Joi.object().pattern(Joi.string(), Joi.any()),
  inputs: Joi.array().items(Joi.link('#form-inputs')).required(),
});

const FORM_TIME_INPUT_VIEW_SCHEMA = Joi.object({
  ...FORM_BASE_INPUT_PROPERTIES,
  $type: Joi.string().allow('time').required(),
});

const FORM_TEXT_INPUT_SCHEMA = Joi.object<TGeneratedFormTextInput>({
  ...FORM_BASE_INPUT_PROPERTIES,
  $type: Joi.string().allow('text').required(),
  isEnabled: Joi.bool(),
});

const FORM_SELECT_INPUT_SCHEMA = Joi.object<TGeneratedFormSelectInput>({
  ...FORM_BASE_INPUT_PROPERTIES,
  $type: Joi.string().allow('select').required(),
  enableSearch: Joi.bool(),
  data: Joi.alternatives(
    Joi.object({
      $type: Joi.string().allow('datasource').required(),
      value: Joi.string().required(),
    }).required(),
    Joi.object({
      $type: Joi.string().allow('constant').required(),
      value: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          value: Joi.string().required(),
          label: Joi.string().required(),
        }).required(),
      ).required(),
    }).required(),
  ).required(),
});

const FORM_INPUTS_SCHEMA = Joi.alternatives(
  FORM_TEXT_INPUT_SCHEMA,
  FORM_SELECT_INPUT_SCHEMA,
  FORM_NESTED_FORM_VIEW_SCHEMA,
  FORM_TIME_INPUT_VIEW_SCHEMA,
).id('form-inputs');

const FORM_FORM_VIEW_SCHEMA = Joi.object<TFormView>({
  $type: Joi.string().allow('form').required(),
  inputs: Joi.array().items(FORM_INPUTS_SCHEMA).required(),
  endpoint: CUSTOM_APP_GENERATED_FORM_ENDPOINT_SCHEMA.required(),
  initialValues: Joi.alternatives(
    CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA,
    Joi.object().pattern(Joi.string(), Joi.any()).required(),
  ).required(),
  postEndpointActions: Joi.array().items(
    Joi.alternatives(
      Joi.object({
        $type: Joi.string().allow('redirect').required(),
        url: Joi.alternatives(
          CUSTOM_APP_JSONATA_EXPRESSION_SCHEMA.required(),
          CUSTOM_APP_CONSTANT_STRING_EXPRESSION_SCHEMA.required(),
        ).required(),
      })
    ),
  ),
})

const FORM_LIST_VIEW_SCHEMA = Joi.object(FORM_LIST_VIEW_PROPERTIES);

const FORM_VIEW_GROUP_VIEW_PROPERTIES = {
  $type: Joi.string().allow('view-group').required(),
  views: Joi.array().items(
    Joi.link('#form-views').required(),
  ).required(),
};

const SECTION_COMPONENT_SCHEMA = Joi.object<TSectionView>({
  $type: Joi.string().allow('section').required(),
  label: Joi.string().required(),
  views: Joi.array().items(Joi.link('#form-views')).required(),
});

const FORM_VIEW_GROUP_SCHEMA = Joi.object(FORM_VIEW_GROUP_VIEW_PROPERTIES);

const FORM_VIEWS_SCHEMA = Joi.alternatives(
  FORM_VIEW_GROUP_SCHEMA,
  FORM_LIST_VIEW_SCHEMA,
  FORM_BUTTON_VIEW_SCHEMA,
  FORM_IFRAME_VIEW_SCHEMA,
  FORM_FORM_VIEW_SCHEMA,
  SECTION_COMPONENT_SCHEMA,
).id('form-views');

const CUSTOM_APP_BASE_VIEW_PROPERTIES = {
  id: Joi.string().required(),
  datasource: Joi.object().pattern(Joi.string(), CUSTOM_APP_FORM_DATA_SOURCE_SCHEMA),
};

const CUSTOM_APP_LIST_VIEW_SCHEMA = Joi.object({
  ...CUSTOM_APP_BASE_VIEW_PROPERTIES,
  ...FORM_LIST_VIEW_PROPERTIES,
});

const CUSTOM_APP_VIEW_GROUP_SCHEMA = Joi.object({
  ...CUSTOM_APP_BASE_VIEW_PROPERTIES,
  $type: Joi.string().allow('view-group').required(),
  views: Joi.array().items(FORM_VIEWS_SCHEMA).required(),
});

const CUSTOM_APP_NAVIGATION_ITEM_SCHEMA = Joi.object<AppNavigationItem>({
  name: Joi.string().required(),
  icon: Joi.string().required(),
  path: Joi.string().required(),
});

const CUSTOM_APP_NAVIGATION_SCHEMA = Joi.object<AppNavigation>({
  id: Joi.string().required(),
  position: Joi.string().required(),
  items: Joi.array().items(CUSTOM_APP_NAVIGATION_ITEM_SCHEMA).required(),
});

export const CUSTOM_APP_SCHEMA = Joi.object<TCustomAppConfig>({
  mainView: Joi.string().required(),
  name: Joi.string().required(),
  views: Joi.array().items(
    Joi.alternatives([
      CUSTOM_APP_LIST_VIEW_SCHEMA.required(),
      CUSTOM_APP_VIEW_GROUP_SCHEMA.required(),
    ]).required(),
  ).required(),
  navigation: Joi.array().items(CUSTOM_APP_NAVIGATION_ITEM_SCHEMA),
  navigations: Joi.array().items(CUSTOM_APP_NAVIGATION_SCHEMA),
});

async function validateCustomAppConfig(config: TCustomAppConfig): Promise<boolean> {
  try {
    await CUSTOM_APP_SCHEMA.validateAsync(config, {
      abortEarly: false,
    });

    return true;
  } catch (e) {
    console.error('Custom App configuration is invalid:', e);
    console.error(JSON.stringify((e as any)?.details, null, 2));
    return false;
  }
}

async function evaluateDatasource(
  dataSource: TGeneratedFormDataSource,
  options: { context: Record<string, unknown>; baseUrl: string; },
): Promise<unknown> {
  const url = new URL(await jsonataUtils.evaluateStringValue(dataSource.path, options.context), options.baseUrl);
  const dataResponse = await fetchCustom(url.toString(), {
    method: dataSource.method,
    headers: dataSource.headers,
  });
  const rawData = await dataResponse.json();

  let transformedResponse = {
    body: rawData,
  }
  if (dataSource.transformResponse?.value) {
    transformedResponse = await (jsonata(dataSource.transformResponse.value)
      .evaluate(transformedResponse));
  }

  return transformedResponse.body;
}

async function evaluateDatasources(
  dataSources?: Record<string, TGeneratedFormDataSource>,
  options: { context: Record<string, unknown>; baseUrl: string; } = { context: {}, baseUrl: '' },
) {
  if (!dataSources) {
    return {};
  }

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
