import { AppDefinitionType } from "@/constants/app.type";

export const FrontendAppDefinition: AppDefinitionType = {
  name: 'Frontend',
  basePath: '/frontend',
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }],
  routes: {
    '/{*path}': {
      navigation: [
        { name: 'Übersicht', path: '/', icon: 'layer-group' },
        { name: 'Projekte', path: '/project', icon: 'project-diagram' },
      ],
    },
    '/project{/*path}': {
      navigation: [
        { name: 'Zurück zur Übersicht', path: '/', icon: 'arrow-left' },
        { name: 'Projekte', path: '/project', icon: 'layer-group' },
      ],
    },
    '/project/:projectId{/*path}': {
      navigation: [
        { name: 'Zurück zu Projekten', path: '/project', icon: 'arrow-left' },
        {
          name: 'Projekt',
          path: { $type: 'jsonata', value: "'/project/' & params.projectId" },
          icon: 'folder',
        },
        {
          name: 'Versionen',
          path: { $type: 'jsonata', value: "'/project/' & params.projectId & '/version'" },
          icon: 'code-branch',
        },
      ],
    },
  },
};
