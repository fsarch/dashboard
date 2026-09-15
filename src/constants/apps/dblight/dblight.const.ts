import { AppDefinitionType } from "@/constants/app.type";

export const DblightAppDefinition: AppDefinitionType = {
  name: 'Database',
  basePath: '/dblight',
  navigation: [{
    name: 'Collections',
    path: '/',
    icon: 'database',
  }],
  routes: {
    '/collection/:collectionId{/*path}': {
      navigation: [{
        name: 'Zurück zu Collections',
        path: '/',
        icon: 'arrow-left',
      }, {
        name: 'Collection',
        path: {
          $type: 'jsonata',
          value: "'/collection/' & params.collectionId",
        },
        icon: 'table',
      }, {
        name: 'Einträge',
        path: {
          $type: 'jsonata',
          value: "'/collection/' & params.collectionId & '/record'",
        },
        icon: 'list',
      }],
    },
  },
};
