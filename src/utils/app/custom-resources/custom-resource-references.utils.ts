import type {
  TCustomResourceApiRequest,
  TCustomResourceDefinition,
} from './custom-resources.type';

// Bewusst ohne serverseitige Imports (fetchService/getConfiguration), damit
// diese Datei direkt aus einer Client-Komponente importierbar ist (siehe
// SelectCustomResourceDialog.component.tsx) - custom-resources.utils.ts ist
// dafür ungeeignet, da es fetchService/getConfiguration lädt.

export type TCustomResourceOpenReference = {
  // Der vollständige Platzhalter-Ausdruck ohne {{ }}, z. B.
  // "$system.crd.catalog.id" - dient als vars-Key für resolvePlaceholders/
  // resolveQueryParams in custom-resources.utils.ts.
  placeholder: string;
  // Die referenzierte Custom-Resource-Definitions-ID, z. B. "catalog".
  resourceId: string;
};

// Platzhalter der Form {{$system.crd.<resourceId>.id}} - ein Verweis auf die
// id einer Instanz eines anderen Custom-Resource-Typs desselben Service
// (siehe @fsarch/server/custom-resource README, "Custom Resource
// References"). Muss aufgelöst sein, bevor die Route aufrufbar ist.
const OPEN_REFERENCE_PATTERN =
  /\{\{\s*(\$system\.crd\.([A-Za-z0-9_-]+)\.id)\s*\}\}/g;

const findReferencesIn = (value: string): TCustomResourceOpenReference[] =>
  Array.from(value.matchAll(OPEN_REFERENCE_PATTERN)).map(
    ([, placeholder, resourceId]) => ({ placeholder, resourceId }),
  );

// Sammelt alle $system.crd.<resourceId>.id-Platzhalter aus Pfad und
// Query-Parametern einer einzelnen Route.
export const getOpenCustomResourceReferences = (
  request: TCustomResourceApiRequest,
): TCustomResourceOpenReference[] => {
  const values = [
    request.path,
    ...Object.values(request.queryParams ?? {}).flatMap((value) =>
      Array.isArray(value) ? value : [value],
    ),
  ];
  const byPlaceholder = new Map<string, TCustomResourceOpenReference>();
  values.forEach((value) =>
    findReferencesIn(value).forEach((ref) =>
      byPlaceholder.set(ref.placeholder, ref),
    ),
  );
  return Array.from(byPlaceholder.values());
};

// Wie getOpenCustomResourceReferences, aber über list-, get- und
// search-Route einer Definition hinweg vereinigt - alle müssen aufgelöst
// sein, bevor eine Instanz dieses Typs ausgewählt/abgerufen werden kann.
export const getOpenReferencesForResource = (
  resource: TCustomResourceDefinition,
): TCustomResourceOpenReference[] => {
  const requests = [
    resource.apiRoutes.list?.request,
    resource.apiRoutes.get?.request,
    resource.apiRoutes.search?.request,
  ].filter((request): request is TCustomResourceApiRequest => Boolean(request));

  const byPlaceholder = new Map<string, TCustomResourceOpenReference>();
  requests.forEach((request) =>
    getOpenCustomResourceReferences(request).forEach((ref) =>
      byPlaceholder.set(ref.placeholder, ref),
    ),
  );
  return Array.from(byPlaceholder.values());
};
