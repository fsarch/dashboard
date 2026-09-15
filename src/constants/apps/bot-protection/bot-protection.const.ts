import { AppDefinitionType } from "@/constants/app.type";

export const BotProtectionAppDefinition: AppDefinitionType = {
  name: 'Bot Protection',
  basePath: '/bot-protection',
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Claims',
    path: '/claim',
    icon: 'shield-halved',
  }],
};
