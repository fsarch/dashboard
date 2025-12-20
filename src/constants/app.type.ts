import { TIcon } from "@/components/universals/icon/Icon.type";

export type AppNavigationItem = {
  name: string;
  path: string | {
    $type: 'jsonata',
    value: string;
  };
  icon?: TIcon;
};

export type AppNavigation = {
  id: string;
  position: 'sidebar' | 'sidebar-bottom';
  items: Array<AppNavigationItem>;
};

export type AppDefinitionType = {
  name: string;
  basePath: string;
  navigation?: Array<AppNavigationItem>;
  navigations?: Array<AppNavigation>;
  routes?: {
    [route: string]: {
      navigation?: Array<AppNavigationItem>;
      navigations?: Array<AppNavigation>;
    };
  };
};
