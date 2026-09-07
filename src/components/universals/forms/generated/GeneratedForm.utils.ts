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
import { serializeError, type ErrorObject } from "serialize-error";

// jsonata's object-constructor expressions (e.g. `{ "name": "" }`) build their
// result via `Object.create(null)`, which yields plain-looking objects with a
// *null* prototype. React Server Components refuse to serialize those (and
// class instances, like the Error produced by `serializeError`) across the
// server/client boundary ("Only plain objects... can be passed to Client
// Components"). Anything derived from a jsonata evaluation that ends up as a
// prop on <GeneratedClientForm> must be normalized back to plain
// Object.prototype-based values first.
const toPlainJson = <T>(value: T): T => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

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

    if (input.$type === 'file-upload') {
      const dataToUpload = formData[input.id] as { 
        $type: 'files'; 
        files: Array<{ name: string; type: string; base64: string; size: number }>; 
      };

      if (!dataToUpload?.files?.length) {
        formData[input.id] = null;
        return;
      }

      // Store files as array in form data for JSON submission
      formData[input.id] = dataToUpload.files;
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

  // Post-submit actions (e.g. redirects) only make sense when the endpoint
  // actually succeeded - a failed submission (4xx/5xx) shouldn't redirect
  // the user away as if nothing went wrong.
  if (!createResponse.ok) {
    return {
      response: {
        status: createResponse.status,
        ok: false,
        body: createData,
      },
      actions: [],
    };
  }

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
      status: createResponse.status,
      ok: true,
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
        const modifiedData = toPlainJson(await (jsonata(value.transformResponse.value).evaluate(responseData)));

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
        const serializedError = serializeError(error) as ErrorObject;

        if (collectDebugInfo) {
          dataSourceDebugData[key].transformation = {
            isError: true,
            expression: value.transformResponse.value,
            input: responseData,
            // serializeError() returns an Error *instance* (a class), which
            // is just as unserializable across the RSC boundary as a
            // null-prototype object - flatten it to a plain object.
            error: { name: serializedError.name, message: serializedError.message, stack: serializedError.stack },
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
    ? toPlainJson(await jsonata(definition.initialValues.value as string).evaluate(
      mergedContext
    ))
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
