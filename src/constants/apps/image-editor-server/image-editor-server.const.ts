import { AppDefinitionType } from "@/constants/app.type";

export const ImageEditorServerAppDefinition: AppDefinitionType = {
  name: 'Image Editor',
  basePath: '/image-editor-server',
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Projekte',
    path: '/project',
    icon: 'project-diagram',
  }],
  routes: {
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
    '/project/:projectId/version/:versionId{/*path}': {
      navigation: [
        {
          name: 'Zurück zu Versionen',
          path: { $type: 'jsonata', value: "'/project/' & params.projectId & '/version'" },
          icon: 'arrow-left',
        },
        {
          name: 'Version',
          path: { $type: 'jsonata', value: "'/project/' & params.projectId & '/version/' & params.versionId" },
          icon: 'code-branch',
        },
        {
          name: 'Parameter',
          path: { $type: 'jsonata', value: "'/project/' & params.projectId & '/version/' & params.versionId & '/parameter'" },
          icon: 'sliders',
        },
        {
          name: 'Ebenen',
          path: { $type: 'jsonata', value: "'/project/' & params.projectId & '/version/' & params.versionId & '/layers'" },
          icon: 'layer-group',
        },
      ],
    },
  },
};
