import { EServiceType } from "@/utils/configuration.type";

export type NavigationItem = {
  name: string;
  path: string | {
    $type: 'jsonata',
    value: string;
  };
};

export const SERVICES: Record<EServiceType, {
  name: string;
  basePath: string;
  navigation?: Array<NavigationItem>;
  routes?: {
    [route: string]: {
      navigation?: Array<NavigationItem>;
    };
  };
}> = {
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
      name: 'Home',
      path: '/',
    }, {
      name: 'Kataloge',
      path: '/catalog',
    }, {
      name: 'Lokalisierungen',
      path: '/localization',
    }],
    routes: {
      '/catalog/:catalogId': {
        navigation: [{
          name: 'Up',
          path: '/',
        }, {
          name: 'Home',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId",
          },
        }, {
          name: 'Items',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/item'",
          },
        }, {
          name: 'Attributes',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/attribute'",
          },
        }, {
          name: 'Element-Types',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/item-type'",
          },
        }],
      },
    },
  },
  [EServiceType.IMAGE]: {
    name: 'Image',
    basePath: '/image',
  },
  [EServiceType.MATERIAL_TRACING]: {
    name: 'Material Tracing',
    basePath: '/material-tracing',
    navigation: [{
      name: 'Home',
      path: '/',
    }, {
      name: 'Manufacturers',
      path: '/manufacturer',
    }, {
      name: 'Materials',
      path: '/material',
    }, {
      name: 'Material-Types',
      path: '/material-type',
    }, {
      name: 'Parts',
      path: '/part',
    }, {
      name: 'Part-Types',
      path: '/part-type',
    }, {
      name: 'Short-Codes',
      path: '/short-code',
    }],
  },
  [EServiceType.CUSTOM_APP]: {
    name: 'CustomApp',
    basePath: '/custom-app',
  },
  [EServiceType.PDF_RENDER]: {
    name: 'PDF Render',
    basePath: '/pdf-render',
  },
};
