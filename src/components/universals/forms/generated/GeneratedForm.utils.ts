import {
  TGeneratedFormDefinition,
  TGeneratedFormInitialValues, TJsonataExpression
} from "@/components/universals/forms/generated/GeneratedForm.type";
import jsonata from "jsonata";
import { fetchService } from "@/utils/fetchService";

function evaluateField(value: string | TJsonataExpression) {
  if (typeof value === "string") {
    return async () => value;
  }

  const expressionBuilder = jsonata(value.value);

  return async (value: unknown) => expressionBuilder.evaluate(value);
}

const createServerAction = (definition: TGeneratedFormDefinition) => {
  const pathExpression = evaluateField(definition.endpoint.path);
  const bodyExpression = evaluateField(definition.endpoint.body);

  return async (formData: TGeneratedFormInitialValues) => {
    const context = {
      form: formData,
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
    const createData = await createResponse.json();

    return createData;
  };
}

export const generatedFormUtils = {
  createServerAction,
};
