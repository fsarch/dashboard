import { AppDefinitionType } from "@/constants/app.type";

export const FunctionAppDefinition: AppDefinitionType = {
  name: 'Functions',
  basePath: '/function',
  navigation: [{
    name: 'Funktionen',
    path: '/',
    icon: 'layer-group',
  }],
  routes: {
    '/function/:functionId{/*path}': {
      navigation: [{
        name: 'Funktionen',
        path: '/',
        icon: 'layer-group',
      }, {
        name: 'Code',
        path: {
          $type: 'jsonata',
          value: "'/function/' & params.functionId",
        },
        icon: 'code',
      }, {
        name: 'Versionen',
        path: {
          $type: 'jsonata',
          value: "'/function/' & params.functionId & '/versions'",
        },
        icon: 'code-branch',
      }, {
        name: 'Einstellungen',
        path: {
          $type: 'jsonata',
          value: "'/function/' & params.functionId & '/settings'",
        },
        icon: 'gear',
      }, {
        name: 'Executions',
        path: {
          $type: 'jsonata',
          value: "'/function/' & params.functionId & '/executions'",
        },
        icon: 'play',
      }],
    },
  },
};
