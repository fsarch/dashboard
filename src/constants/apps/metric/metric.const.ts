import { AppDefinitionType } from "@/constants/app.type";

export const MetricAppDefinition: AppDefinitionType = {
  name: 'Metrics',
  basePath: '/metric',
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Metric Types',
    path: '/metric-type',
    icon: 'tag',
  }, {
    name: 'Metrics',
    path: '/metric',
    icon: 'chart-line',
  }],
  routes: {
    '/metric': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [{
          name: 'Papierkorb',
          path: '/metric/trash',
          icon: 'trash',
        }],
      }],
    },
  },
};
