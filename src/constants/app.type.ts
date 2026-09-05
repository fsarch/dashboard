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

export type AppFloatingButton = {
  // channel id for useFloatingButtonClick(id, ...) - whoever registers a
  // listener for this id defines what happens when the button is clicked
  // (see src/components/universals/floating-button/FloatingButtonProvider.context.ts)
  id: string;
  icon?: TIcon;
};

export type AppDefinitionType = {
  name: string;
  basePath: string;
  navigation?: Array<AppNavigationItem>;
  navigations?: Array<AppNavigation>;
  floatingButton?: AppFloatingButton;
  routes?: {
    [route: string]: {
      navigation?: Array<AppNavigationItem>;
      navigations?: Array<AppNavigation>;
      floatingButton?: AppFloatingButton;
    };
  };
};
