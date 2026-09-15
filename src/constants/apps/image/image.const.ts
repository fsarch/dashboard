import { AppDefinitionType } from "@/constants/app.type";

export const ImageAppDefinition: AppDefinitionType = {
  name: 'Image',
  basePath: '/image',
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Bilder',
    path: '/',
    icon: 'images',
  }, {
    name: 'Tag-Definitionen',
    path: '/tags',
    icon: 'tags',
  }],
};
