import { AppDefinitionType } from "@/constants/app.type";

export const AiAppDefinition: AppDefinitionType = {
  name: 'AI',
  basePath: '/ai',
  navigation: [{
    name: 'Start',
    path: '/',
    icon: 'comment-dots',
  }, {
    name: 'Konversationen',
    path: '/conversations',
    icon: 'list',
  }],
};
