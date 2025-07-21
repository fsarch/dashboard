import React, { PropsWithChildren } from 'react';
import Header from "@/components/navigation/Header";
import { getCurrentServiceBaseConfiguration } from "@/utils/configuration.utils";
import { NavigationItem, APPS } from "@/constants/apps";
import { AutoNavigation } from "@/components/universals/page/AutoNavigation.component";
import styles from './DefaultPage.module.scss';
import { headers } from "next/headers";
import { match } from 'path-to-regexp';
import memoize from 'lodash.memoize';
import jsonata from "jsonata";
import { TIcon } from "@/components/universals/icon/Icon.type";
import clsx from 'clsx';

type DefaultPageProps = PropsWithChildren<{
  className?: string;
}>;

const createPathMatcher = memoize((route: string) => {
  return match(route);
});

export const DefaultPage: React.FunctionComponent<DefaultPageProps> = async ({
  children,
  className,
}) => {
  let baseConfiguration;
  try {
    baseConfiguration = await getCurrentServiceBaseConfiguration();
  } catch {
    return children;
  }

  const config = APPS[baseConfiguration.type];

  let navigations: Array<NavigationItem> | undefined = config.navigation;
  let matchedRouteParams: Partial<Record<string, string | Array<string>>> = {};

  const serviceRoute = (await headers()).get('X-Service-Path');
  if (config.routes) {
    Object.entries(config.routes).forEach(([route, routeDefinition]) => {
      const match = createPathMatcher(route)(serviceRoute ?? '/');
      if (match) {
        navigations = routeDefinition.navigation;
        matchedRouteParams = match.params;
      }
    });
  }

  if (navigations) {
    navigations = await Promise.all(navigations.map(async (navigation) => {
      if (typeof navigation.path === 'string') {
        return navigation;
      }

      try {
        const path = await jsonata(navigation.path.value).evaluate({
          params: matchedRouteParams,
        });

        return {
          ...navigation,
          path,
        };
      } catch (error) {
        console.error(error);

        return navigation;
      }
    }));

    if (serviceRoute) {
      navigations = navigations.map((navigation) => {
        return {
          ...navigation,
          isSelected: serviceRoute.localeCompare(navigation.path as string) === 0,
        };
      });
    }
  }

  return (
    <div className={clsx(className, styles.root)}>
      <header className={styles.header}>
        <Header title={baseConfiguration.name ?? 'Unknown Service'}/>
      </header>
      {navigations ? (
        <nav className={styles.navigation}>
          <AutoNavigation
            navigation={navigations as unknown as Array<{ name: string; path: string; isSelected: boolean; icon?: TIcon; }>}
          />
        </nav>
      ) : null}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
