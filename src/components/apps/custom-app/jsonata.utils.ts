import { TJsonataExpression } from "@/components/universals/forms/generated/GeneratedForm.type";
import jsonata from "jsonata";

async function evaluateStringValue(value: string | TJsonataExpression, context?: Record<string, unknown>): Promise<string> {
  if (typeof value === "string") {
    return value;
  }

  const expressionBuilder = jsonata(value.value);

  return expressionBuilder.evaluate(value, context);
}

export const jsonataUtils = {
  evaluateStringValue,
};
