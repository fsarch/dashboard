import type { AppDefinitionType } from '@/constants/app.type';

export const DamAppDefinition: AppDefinitionType = {
  name: 'DAM',
  basePath: '/dam',
  supportsCustomResources: true,
  navigation: [
    {
      name: 'Mediathek',
      path: '/',
      icon: 'photo-film',
    },
    {
      name: 'Sammlungen',
      path: '/collections',
      icon: 'layer-group',
    },
    {
      name: 'Tags',
      path: '/tags',
      icon: 'tags',
    },
    {
      name: 'Metadaten-Definitionen',
      path: '/metadata-definitions',
      icon: 'list',
    },
  ],
};
