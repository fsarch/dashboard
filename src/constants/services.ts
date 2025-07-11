import { EServiceType } from "@/utils/configuration.type";
import { TIcon } from "@/components/universals/icon/Icon.type";

export type NavigationItem = {
  name: string;
  path: string | {
    $type: 'jsonata',
    value: string;
  };
  icon?: TIcon;
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
  },
  [EServiceType.MATERIAL_TRACING]: {
    name: 'Material Tracing',
    basePath: '/material-tracing',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Manufacturers',
      path: '/manufacturer',
      icon: 'industry',
    }, {
      name: 'Materials',
      path: '/material',
      icon: 'vial',
    }, {
      name: 'Material-Types',
      path: '/material-type',
      icon: {
        $type: 'layers',
        icons: [{
          $type: 'fa-icon',
          icon: 'file',
        }, {
          $type: 'fa-icon',
          icon: 'vial',
          transform: 'shrink-8 down-2',
          color: '#000000',
        }],
      }
    }, {
      name: 'Parts',
      path: '/part',
      icon: 'cube',
    }, {
      name: 'Part-Types',
      path: '/part-type',
      icon: {
        $type: 'layers',
        icons: [{
          $type: 'fa-icon',
          icon: 'file',
        }, {
          $type: 'fa-icon',
          icon: 'cube',
          transform: 'shrink-8 down-2',
          color: '#000000',
        }],
      },
    }, {
      name: 'Short-Codes',
      path: '/short-code',
      icon: 'qrcode',
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
};
