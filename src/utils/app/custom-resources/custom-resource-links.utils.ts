import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { APPS } from '@/constants/apps';
import { AppRouteCustomResourceProvider } from '@/constants/app.type';
import { jsonataUtils } from '@/components/apps/custom-app/jsonata.utils';
import { createPathCompiler } from '@/utils/app/routeMatch.utils';

// Serverseitig (Config-Zugriff) - analog zu custom-resources.utils.ts nicht
// von client-Code importierbar.

// Sucht in der App-Definition des Service-Typs die Route, die per
// providesCustomResource als Detailseite von resourceId markiert ist (siehe
// AppRouteCustomResourceProvider).
const findProvidingRoute = (
  serviceId: string,
  resourceId: string,
): Promise<{ route: string; basePath: string; provider: AppRouteCustomResourceProvider } | undefined> => getServiceConfigurationById(serviceId).then((service) => {
  if (!service) {
    return undefined;
  }
  const appDefinition = APPS[service.type];
  const entry = Object.entries(appDefinition?.routes ?? {})
    .find(([, routeDefinition]) => routeDefinition.providesCustomResource?.resourceId === resourceId);
  if (!entry) {
    return undefined;
  }
  const [route, routeDefinition] = entry;
  return { route, basePath: appDefinition.basePath, provider: routeDefinition.providesCustomResource! };
});

// Baut, sofern eine App-Route resourceId als bereitgestellt markiert hat, den
// Link zur Detailseite der übergebenen Instanz (z. B. um aus dem
// material-tracing-PartType-Formular zurück auf den referenzierten Product-
// Item zu springen). Liefert undefined, wenn keine Route dafür registriert
// ist - Aufrufer blenden den Sprung-Button dann einfach aus.
const buildHref = async (
  serviceId: string,
  resourceId: string,
  instance: unknown,
  refValues: Record<string, string> = {},
): Promise<string | undefined> => {
  const found = await findProvidingRoute(serviceId, resourceId);
  if (!found) {
    return undefined;
  }

  const context = { serviceId, instance, refValues };
  const paramEntries = await Promise.all(
    Object.entries(found.provider.params ?? {})
      .map(async ([key, value]) => [key, await jsonataUtils.evaluateStringValue(value, context)] as const),
  );

  const path = createPathCompiler(found.route)(Object.fromEntries(paramEntries));
  return `${found.basePath}/${serviceId}${path}`;
};

export const customResourceLinksUtils = {
  buildHref,
};
