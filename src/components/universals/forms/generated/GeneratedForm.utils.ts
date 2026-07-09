import {
  TDataSourceJsonataResponse,
  TEvaluationDebugInfo,
  TEvaluationResult,
  TGeneratedFormAction,
  TGeneratedFormDefinition,
  TGeneratedFormLinkCardInput,
  TGeneratedFormSelectConstantData,
  TGeneratedFormStringConstantData, TGeneratedFormSubmitResponse,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import type { TView } from "@/components/apps/custom-app/custom-app.type";
import jsonata from "jsonata";
import { fetchService } from "@/utils/fetchService";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { jsonataUtils } from "@/components/apps/custom-app/jsonata.utils";
import { contextUtils } from "@/components/universals/forms/generated/context.utils";
import { serializeError } from "serialize-error";

const executePostSubmitAction = async (
  definition: TGeneratedFormDefinition,
  formData: Record<string, unknown>,
  args: Record<string, unknown> | undefined,
  context?: Record<string, unknown>,
): Promise<TGeneratedFormSubmitResponse> => {
  const { definition: evaluatedDefinition } = await evaluateDefinition(definition, { args });

  await Promise.all(evaluatedDefinition.inputs.map(async (input) => {
    if (input.$type === 'image-server-upload') {
      const dataToUpload = formData[input.id] as { $type: 'files'; files: [{ name: string; type: string; base64: string; }] };

      if (!dataToUpload.files[0]) {
        formData[input.id] = null;
        return;
      }

      if (input.imageServerAdminUrl.$type !== 'constant') {
        throw new Error('unevaluated expression for imageServerAdminUrl');
      }

      const imageData = Buffer.from(dataToUpload.files[0].base64, 'base64');
      const baseUrl = input.imageServerAdminUrl.value;

      const uploadResponse = await fetchService(`${baseUrl}/v1/admin/images/_actions/upload`, {
        method: 'POST',
        body: imageData,
        headers: {
          'Content-Type': dataToUpload.files[0].type,
        },
      });

      if (uploadResponse.status !== 201) {
        console.error({
          message: 'invalid response code from image server',
          data: {
            status: uploadResponse.status,
          },
        });
        throw new Error('could not upload image to image-server');
      }

      const body = await uploadResponse.json();
      let response = {
        body,
      };

      if (input.transformResponse) {
        response = await jsonata(input.transformResponse.value).evaluate(response);
      }

      formData[input.id] = response.body;
    }
  }));

  const requestContext = {
    ...context,
    form: formData,
    args,
  };

  const [path, body] = await Promise.all([
    jsonataUtils.evaluateStringValue(definition.endpoint.path, requestContext),
    jsonataUtils.evaluateValue(definition.endpoint.body, requestContext),
  ]);

  const createResponse = await fetchService(path, {
    method: definition.endpoint.method,
    body: JSON.stringify(body),
    headers: {
      ...definition.endpoint.headers,
      'Content-Type': 'application/json',
    },
  });
  const createData = createResponse.headers.get('Content-Type')?.startsWith('application/json') ? await createResponse.json() : null;

  const actions = await Promise.all((evaluatedDefinition.postEndpointActions ?? []).map(async (postEndpointAction) => {
    if (postEndpointAction.url.$type === "jsonata") {
      return {
        ...postEndpointAction,
        url: {
          $type: 'constant',
          value: await jsonata(postEndpointAction.url.value).evaluate({
            response: {
              body: createData,
            },
            service: {
              localPath: await getServiceLocalUrl(''),
            },
            args,
          }),
        }
      }
    }
  }));

  return {
    response: {
      body: createData,
    },
    actions: actions.filter((a): a is TGeneratedFormAction => !!a),
  };
}

const evaluateDefinition = async (
  definition: TGeneratedFormDefinition,
  {
    args,
    context = { args },
    collectDebugInfo = false,
  }: {
    args?: Record<string, unknown>;
    context?: Record<string, unknown>;
    collectDebugInfo?: boolean;
  }): Promise<TEvaluationResult> => {
  const dataSourceDebugData: TEvaluationDebugInfo['dataSourceResponses'] = {};

  const dataSourceData = Object.fromEntries(await Promise.all(Object.entries(definition.dataSources ?? {}).map(async ([key, value]) => {
    const path = await jsonataUtils.evaluateStringValue(value.path, { args });
    const dataResponse = await fetchService(path, {
      method: value.method,
    });
    const rawData = await dataResponse.json();

    let responseData: TDataSourceJsonataResponse = {
      status: dataResponse.status,
      statusText: dataResponse.statusText,
      body: rawData,
    };

    if (collectDebugInfo) {
      // debug info for devs to see the raw and transformed data from datasources
      dataSourceDebugData[key] = {
        url: path,
        method: value.method,
        status: dataResponse.status,
        statusText: dataResponse.statusText,
        body: {
          rawJson: rawData,
        },
      };
    }

    if (value.transformResponse?.value) {
      try {
        const modifiedData = await (jsonata(value.transformResponse.value).evaluate(responseData));

        if (collectDebugInfo) {
          // add transformed data to debug info
          dataSourceDebugData[key].transformation = {
            isError: false,
            expression: value.transformResponse.value,
            input: responseData,
            output: modifiedData,
          };
        }

        responseData = modifiedData;
      } catch (error) {
        const serializedError = serializeError(error);

        if (collectDebugInfo) {
          dataSourceDebugData[key].transformation = {
            isError: true,
            expression: value.transformResponse.value,
            input: responseData,
            error: serializedError,
          }
        }

        responseData = {
          status: 500,
          statusText: 'Error evaluating transformResponse expression',
          body: null,
        };
      }
    }

    return [key, responseData.body];
  })));

  const mergedContext = contextUtils.merge(context, {
    dataSource: dataSourceData,
    ...context,
  });

  async function evaluateViews(views: Array<TView>): Promise<Array<TView>> {
    return Promise.all(views.map(async (view) => {
      if (view.$type === 'paragraph' && typeof view.text !== 'string') {
        return {
          ...view,
          text: await jsonataUtils.evaluateStringValue(view.text, mergedContext),
        };
      }

      if (view.$type === 'section') {
        return {
          ...view,
          views: await evaluateViews(view.views),
        };
      }

      if (view.$type === 'view-group') {
        return {
          ...view,
          views: await evaluateViews(view.views),
        };
      }

      return view;
    }));
  }

  const mappedInputs = await Promise.all(definition.inputs.map(async (input) => {
    if (input.$type === 'select' && input.data.$type === 'datasource') {
      return {
        ...input,
        data: {
          $type: 'constant',
          value: (mergedContext.dataSource ?? dataSourceData)[input.data.value],
        } as TGeneratedFormSelectConstantData,
      }
    }

    if (input.$type === 'image-server-upload' && input.imageServerAdminUrl.$type === 'datasource') {
      return {
        ...input,
        imageServerAdminUrl: {
          $type: 'constant',
          value: dataSourceData[input.imageServerAdminUrl.value],
        } as TGeneratedFormStringConstantData,
      };
    }

    if (input.$type === 'link-card') {
      const linkCardInput = input as TGeneratedFormLinkCardInput;

      return {
        ...linkCardInput,
        href: linkCardInput.href
          ? await jsonataUtils.evaluateStringValue(linkCardInput.href, mergedContext)
          : undefined,
        views: await evaluateViews(linkCardInput.views),
      };
    }

    return input;
  }));

  const mappedInitialValues = definition.initialValues.$type === 'jsonata'
    ? await jsonata(definition.initialValues.value as string).evaluate(
      mergedContext
    )
    : definition.initialValues;

  return {
    definition: {
      inputs: mappedInputs,
      dataSources: definition.dataSources,
      initialValues: mappedInitialValues,
      endpoint: definition.endpoint,
      postEndpointActions: definition.postEndpointActions,
      buttons: definition.buttons,
    },
    debugInfo: collectDebugInfo ? {
      dataSourceResponses: dataSourceDebugData,
    } : undefined,
  };
};

export const generatedFormUtils = {
  executePostSubmitAction,
  evaluateDefinition,
};
