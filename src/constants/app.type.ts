import { TIcon } from "@/components/universals/icon/Icon.type";

export type AppNavigationItem = {
  name: string;
  path: string | {
    $type: 'jsonata',
    value: string;
  };
  icon?: TIcon;
};

export type AppNavigation = {
  id: string;
  position: 'sidebar' | 'sidebar-bottom';
  items: Array<AppNavigationItem>;
};

export type AppFloatingButton = {
  // channel id for useFloatingButtonClick(id, ...) - whoever registers a
  // listener for this id defines what happens when the button is clicked
  // (see src/components/universals/floating-button/FloatingButtonProvider.context.ts)
  id: string;
  icon?: TIcon;
};

// Markiert eine Route als Detailseite eines Custom-Resource-Typs (id aus GET
// /v1/.meta/custom-resources dieses App-Typs) - ermöglicht einen "Rücksprung"
// von einer anderen App, die per SelectCustomResourceDialog/
// CustomResourcePickerInput auf eine Instanz dieses Typs verweist (z. B.
// material-tracing -> product), zu genau dieser Seite (siehe
// custom-resource-links.utils.ts).
export type AppRouteCustomResourceProvider = {
  resourceId: string;
  // Ein Wert je ":name"-Platzhalter der Routen-Vorlage (Objekt-Key dieses
  // routes-Eintrags), z. B. { catalogId, itemId } für
  // '/catalog/:catalogId/item/:itemId'. Wie AppNavigationItem.path per
  // jsonata auswertbar, Kontext: { serviceId, instance, refValues } - instance
  // sind die rohen JSON-Daten der Instanz, refValues die bereits aufgelösten
  // $system.crd-Referenzwerte (siehe custom-resource-references.utils.ts),
  // z. B. um refValues.`$system.crd.catalog.id` als catalogId einzusetzen.
  params?: Record<string, string | {
    $type: 'jsonata',
    value: string;
  }>;
};

export type AppDefinitionType = {
  name: string;
  basePath: string;
  // Ob das Backend dieser App das CustomResourcesModule exponiert
  // (GET /v1/.meta/custom-resources). Steuert den "Custom Resources"-
  // Einstieg im Development-Bereich für Services dieses Typs.
  supportsCustomResources?: boolean;
  navigation?: Array<AppNavigationItem>;
  navigations?: Array<AppNavigation>;
  floatingButton?: AppFloatingButton;
  routes?: {
    [route: string]: {
      navigation?: Array<AppNavigationItem>;
      navigations?: Array<AppNavigation>;
      floatingButton?: AppFloatingButton;
      providesCustomResource?: AppRouteCustomResourceProvider;
    };
  };
};
