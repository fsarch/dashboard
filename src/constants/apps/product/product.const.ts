import { AppDefinitionType } from "@/constants/app.type";

export const ProductAppDefinition: AppDefinitionType = {
  name: 'Product',
  basePath: '/product',
  supportsCustomResources: true,
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Kataloge',
    path: '/catalog',
    icon: 'book',
  }, {
    name: 'Lokalisierungen',
    path: '/localization',
    icon: 'language',
  }],
  routes: {
    '/catalog/:catalogId{/*path}': {
      // Markiert diese Route (ohne den optionalen /*path-Rest) als
      // Detailseite des 'catalog'-Custom-Resource-Typs - ermöglicht z. B.
      // einen Rücksprung-Chevron vom material-tracing-PartType-Formular auf
      // den referenzierten Katalog (siehe CustomResourcePickerInput).
      providesCustomResource: {
        resourceId: 'catalog',
        params: {
          catalogId: { $type: 'jsonata', value: 'instance.id' },
        },
      },
      navigation: [{
        name: 'Katalog-Übersicht',
        path: '/',
        icon: 'book',
      }, {
        name: 'Übersicht',
        path: {
          $type: 'jsonata',
          value: "'/catalog/' & params.catalogId",
        },
        icon: 'layer-group',
      }, {
        name: 'Items',
        path: {
          $type: 'jsonata',
          value: "'/catalog/' & params.catalogId & '/item'",
        },
        icon: 'sitemap',
      }, {
        name: 'Item-List',
        path: {
          $type: 'jsonata',
          value: "'/catalog/' & params.catalogId & '/item-list'",
        },
        icon: 'list',
      }, {
        name: 'Attributes',
        path: {
          $type: 'jsonata',
          value: "'/catalog/' & params.catalogId & '/attribute'",
        },
        icon: 'hashtag',
      }, {
        name: 'Element-Types',
        path: {
          $type: 'jsonata',
          value: "'/catalog/' & params.catalogId & '/item-type'",
        },
        icon: 'puzzle-piece',
      }],
    },
    // Kein eigener navigation-Eintrag nötig: die Item-Detailseite matcht
    // zusätzlich zur obigen Katalog-Route, deren Katalog-Navigation bleibt
    // dadurch unverändert sichtbar (siehe navigation.utils.ts, "last match
    // wins" nur für tatsächlich gesetzte navigation/navigations).
    '/catalog/:catalogId/item/:itemId': {
      providesCustomResource: {
        resourceId: 'product',
        params: {
          catalogId: {
            $type: 'jsonata',
            value: 'refValues.`$system.crd.catalog.id`',
          },
          itemId: { $type: 'jsonata', value: 'instance.id' },
        },
      },
    },
  },
};
