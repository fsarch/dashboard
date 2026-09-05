import type { AppDefinitionType, AppFloatingButton } from "@/constants/app.type";
import { headers } from "next/headers";
import { createPathMatcher } from "@/utils/app/routeMatch.utils";

const getFloatingButton = async (
  config: Pick<AppDefinitionType, 'floatingButton' | 'routes'>,
): Promise<AppFloatingButton | undefined> => {
  let floatingButton = config.floatingButton;

  const serviceRoute = (await headers()).get('X-Service-Path');
  if (config.routes) {
    Object.entries(config.routes).forEach(([route, routeDefinition]) => {
      const routeMatch = createPathMatcher(route)(serviceRoute ?? '/');
      if (routeMatch && routeDefinition.floatingButton) {
        floatingButton = routeDefinition.floatingButton;
      }
    });
  }

  return floatingButton;
};

export const floatingButtonUtils = {
  getFloatingButton,
};
