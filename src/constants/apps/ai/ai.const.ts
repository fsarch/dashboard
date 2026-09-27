import type { AppDefinitionType } from '@/constants/app.type';

export const AiAppDefinition: AppDefinitionType = {
  name: 'AI',
  basePath: '/ai',
  navigation: [
    {
      name: 'Start',
      path: '/',
      icon: 'comment-dots',
    },
    {
      name: 'Konversationen',
      path: '/conversations',
      icon: 'list',
    },
    {
      name: 'Agenten',
      path: '/agents',
      icon: 'robot',
    },
  ],
};
