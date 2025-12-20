
import type { AppDefinitionType, AppNavigation, AppNavigationItem } from "@/constants/app.type";
import { headers } from "next/headers";
import memoize from "lodash.memoize";
import { match } from "path-to-regexp";
import { AutoNavigationItemType } from "@/components/universals/page/AutoNavigation.type";
import { jsonataUtils } from "@/components/apps/custom-app/jsonata.utils";

const createPathMatcher = memoize((route: string) => {
  return match(route);
});

const selectNavigation = (data: { navigation?: Array<AppNavigationItem>; navigations?: Array<AppNavigation> }, position: 'sidebar' | 'sidebar-bottom') => {
  let navigations: Array<AppNavigationItem> | undefined = undefined;
  // when position is sidebar, use the old navigation definition for backward compatibility
  if (position === 'sidebar') {
    navigations = data.navigation;
  }
  // search navigation by position
  const foundNavigation = data.navigations?.find((nav) => nav.position === position)?.items;
  if (foundNavigation) {
    navigations = foundNavigation;
  }

  return navigations;
}

const getNavigationItems = async (
  config: AppDefinitionType,
  position: 'sidebar' | 'sidebar-bottom',
): Promise<Array<AutoNavigationItemType> | undefined> => {
  let navigations = selectNavigation(config, position);

  let matchedRouteParams: Partial<Record<string, string | Array<string>>> = {};

  const serviceRoute = (await headers()).get('X-Service-Path');
  if (config.routes) {
    Object.entries(config.routes).forEach(([route, routeDefinition]) => {
      const match = createPathMatcher(route)(serviceRoute ?? '/');
      if (match) {
        const foundNavigation = selectNavigation(routeDefinition, position);
        if (foundNavigation) {
          navigations = foundNavigation;
        }

        matchedRouteParams = match.params;
      }
    });
  }

  if (!navigations) {
    return undefined
  }

  return Promise.all(navigations.map(async (item): Promise<AutoNavigationItemType> => {
    const path = await jsonataUtils.evaluateStringValue(item.path, {
      params: matchedRouteParams,
    });

    if (!serviceRoute) {
      return {
        ...item,
        path,
        isSelected: false,
      };
    }

    return {
      ...item,
      path,
      isSelected: serviceRoute.localeCompare(path) === 0,
    };
  }));
};

export const navigationUtils = {
  getNavigationItems,
};
