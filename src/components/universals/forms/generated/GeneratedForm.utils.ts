import {
  TGeneratedFormAction,
  TGeneratedFormDefinition,
  TGeneratedFormSelectConstantData,
  TGeneratedFormStringConstantData, TGeneratedFormSubmitResponse,
  TJsonataExpression,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import jsonata from "jsonata";
import { fetchService } from "@/utils/fetchService";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { jsonataUtils } from "@/components/apps/custom-app/jsonata.utils";

function evaluateField(value: string | TJsonataExpression | undefined) {
  if (typeof value === "string") {
    return async () => value;
  }

  if (!value) {
    return async () => undefined;
  }

  const expressionBuilder = jsonata(value.value);

  return async (value: unknown) => expressionBuilder.evaluate(value);
}

const executePostSubmitAction = async (
  definition: TGeneratedFormDefinition,
  formData: Record<string, unknown>,
  args: Record<string, unknown> | undefined,
): Promise<TGeneratedFormSubmitResponse> => {
  const pathExpression = evaluateField(definition.endpoint.path);
  const bodyExpression = evaluateField(definition.endpoint.body);

  const evaluatedDefinition = await evaluateDefinition(definition, { args });

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

  const context = {
    form: formData,
    args,
  };

  const [path, body] = await Promise.all([
    pathExpression(context),
    bodyExpression(context),
  ]);

  const createResponse = await fetchService(path, {
    method: definition.endpoint.method,
    body: JSON.stringify(body),
    headers: {
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

const evaluateDefinition = async (definition: TGeneratedFormDefinition, { args }: { args?: Record<string, unknown> }): Promise<TGeneratedFormDefinition> => {
  const dataSourceData = Object.fromEntries(await Promise.all(Object.entries(definition.dataSources ?? {}).map(async ([key, value]) => {
    const path = await jsonataUtils.evaluateStringValue(value.path);
    const dataResponse = await fetchService(path, {
      method: value.method,
    });
    const rawData = await dataResponse.json();

    const transformedResponse = await (jsonata(value.transformResponse.value).evaluate({
      body: rawData,
    }));

    return [key, transformedResponse.body];
  })));

  const mappedInputs = definition.inputs.map((input) => {
    if (input.$type === 'select' && input.data.$type === 'datasource') {
      return {
        ...input,
        data: {
          $type: 'constant',
          value: dataSourceData[input.data.value],
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

    return input;
  });

  const mappedInitialValues = definition.initialValues.$type === 'jsonata'
    ? await jsonata(definition.initialValues.value as string).evaluate({ dataSource: dataSourceData, args })
    : definition.initialValues;

  return {
    inputs: mappedInputs,
    dataSources: definition.dataSources,
    initialValues: mappedInitialValues,
    endpoint: definition.endpoint,
    postEndpointActions: definition.postEndpointActions,
    buttons: definition.buttons,
  };
};

export const generatedFormUtils = {
  executePostSubmitAction,
  evaluateDefinition,
};
