import { AppDefinitionType } from "@/constants/app.type";

export const EmailServerAppDefinition: AppDefinitionType = {
  name: 'Email Server',
  basePath: '/email',
  navigation: [{
    name: 'Accounts',
    path: '/',
    icon: 'layer-group',
  }],
};
