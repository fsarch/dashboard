import { AppDefinitionType } from "@/constants/app.type";

export const FrontierAppDefinition: AppDefinitionType = {
  name: 'Frontier',
  basePath: '/frontier',
  navigation: [{
    name: 'Domain Groups',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Hooks',
    path: '/hook',
    icon: 'code',
  }],
  routes: {
    '/domain-group/:domainGroupId{/*path}': {
      navigation: [{
        name: 'Zu den Domain Groups',
        path: '/',
        icon: 'arrow-left',
      }, {
        name: 'Übersicht',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId",
        },
        icon: 'layer-group',
      }, {
        name: 'Domains',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/domain'",
        },
        icon: 'globe',
      }, {
        name: 'Cache Policies',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/cache-policy'",
        },
        icon: 'database',
      }, {
        name: 'Path Rules',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/path-rule'",
        },
        icon: 'route',
      }, {
        name: 'CORS Policies',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/cors-policy'",
        },
        icon: 'shield-halved',
      }, {
        name: 'Log Policies',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/log-policy'",
        },
        icon: 'file-lines',
      }, {
        name: 'Request Logs',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/request-log'",
        },
        icon: 'list-check',
      }, {
        name: 'Upstream Groups',
        path: {
          $type: 'jsonata',
          value: "'/domain-group/' & params.domainGroupId & '/upstream-group'",
        },
        icon: 'server',
      }, {
        name: 'Hooks',
        path: '/hook',
        icon: 'code',
      }],
    },
  },
};
