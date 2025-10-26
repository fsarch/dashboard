import joiToJsonSchema from "joi-to-json";
import { CUSTOM_APP_SCHEMA } from "@/components/apps/custom-app/custom-app.utils";
import { writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";

async function run() {
  const jsonSchema = joiToJsonSchema(CUSTOM_APP_SCHEMA);
// jsonSchema ist ein JS‑Objekt nach JSON‑Schema
  const jsonSchemaString = JSON.stringify(jsonSchema, null, 2);
  console.log(jsonSchemaString);

  await mkdir('../schemas', { recursive: true });
  writeFileSync('../schemas/custom-app-schema.json', jsonSchemaString);
}

run();
