import { AppDefinitionType } from "@/constants/app.type";

export const ProductAppDefinition: AppDefinitionType = {
  name: 'Product',
  basePath: '/product',
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
  },
};
