import { AppDefinitionType } from "@/constants/app.type";

export const FunctionGatewayAppDefinition: AppDefinitionType = {
  name: 'Function Gateway',
  basePath: '/function-gateway',
  navigation: [{
    name: 'Funktionen',
    path: '/',
    icon: 'layer-group',
  }],
};
