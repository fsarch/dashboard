import { WorkerMetaApiDto } from "@/services/function/function.type";
import {
  API_SERVICES
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/editor-types/definitions.generated";

function generateApiTypes(apiDefinition: WorkerMetaApiDto) {
  const items = Object.entries(apiDefinition).map(([key, definition]) => {
    if (!definition.type) {
      return;
    }

    const typeName = API_SERVICES[definition.type];
    return `'${key}': FsArchApiCatalog.${typeName};`;
  }).filter(val => val);

  return `
    declare interface FsArchApi {
       ${items.join('\n')}
    }
  `;
}

export const customApiUtils = {
  generateApiTypes,
};
