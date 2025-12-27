import { EServiceType } from "@/utils/configuration.type";
import { MaterialTracingAppDefinition } from "@/constants/apps/material-tracing/material-tracing.const";
import { AppDefinitionType } from "@/constants/app.type";

export const APPS: Record<EServiceType, AppDefinitionType> = {
  [EServiceType.CUSTOMER_COMMUNICATION]: {
    name: 'Customer Communication',
    basePath: '/ccm',
  },
  [EServiceType.DATATABLE]: {
    name: 'Datatable',
    basePath: '/datatable',
  },
  [EServiceType.PIM]: {
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
  },
  [EServiceType.IMAGE]: {
    name: 'Image',
    basePath: '/image',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Bilder',
      path: '/',
      icon: 'images',
    }],
  },
  [EServiceType.MATERIAL_TRACING]: MaterialTracingAppDefinition,
  [EServiceType.CUSTOM_APP]: {
    name: 'CustomApp',
    basePath: '/custom-app',
  },
  [EServiceType.PDF_RENDER]: {
    name: 'PDF Render',
    basePath: '/pdf-render',
  },
  [EServiceType.FUNCTION]: {
    name: 'Functions',
    basePath: '/function',
    navigation: [{
      name: 'Funktionen',
      path: '/',
      icon: 'layer-group',
    }],
  },
  [EServiceType.PRINTER]: {
    name: 'Printer Server',
    basePath: '/printer',
  },
  [EServiceType.BACKUP]: {
    name: 'Backup',
    basePath: '/backup',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Jobs',
      path: '/',
      icon: 'hdd',
    }],
  },
};
