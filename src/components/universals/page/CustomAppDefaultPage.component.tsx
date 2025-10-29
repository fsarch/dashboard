import React, { PropsWithChildren } from 'react';
import { getCurrentServiceBaseConfiguration } from "@/utils/configuration.utils";
import { NavigationItem } from "@/constants/apps";
import { AutoNavigation } from "@/components/universals/page/AutoNavigation.component";
import styles from './DefaultPage.module.scss';
import { headers } from "next/headers";
import { match } from 'path-to-regexp';
import memoize from 'lodash.memoize';
import { TIcon } from "@/components/universals/icon/Icon.type";
import clsx from 'clsx';
import DefaultPageHeader from "@/components/universals/page/DefaultPageHeader.component";
import { TCustomAppConfig } from "@/components/apps/custom-app/custom-app.type";
import { jsonataUtils } from "@/components/apps/custom-app/jsonata.utils";

type CustomAppDefaultPageProps = PropsWithChildren<{
  className?: string;
  config: TCustomAppConfig;
  view: string;
}>;

const createPathMatcher = memoize((route: string) => {
  return match(route);
});

export const CustomAppDefaultPage: React.FunctionComponent<CustomAppDefaultPageProps> = async ({
  children,
  className,
  config,
  view,
}) => {
  let baseConfiguration;
  try {
    baseConfiguration = await getCurrentServiceBaseConfiguration();
  } catch {
    return children;
  }

  let navigations: Array<NavigationItem> | undefined = config.navigation;

  if (navigations) {
    navigations = await Promise.all(navigations.map(async (navigation) => {
      if (typeof navigation.path === 'string') {
        return navigation;
      }

      try {
        const path = await jsonataUtils.evaluateStringValue(navigation.path.value);

        return {
          ...navigation,
          path,
        };
      } catch (error) {
        console.error(error);

        return navigation;
      }
    }));

    const serviceRoute = (await headers()).get('X-Service-Path')?.substring(1);
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
      <DefaultPageHeader
        className={styles.header}
        title={baseConfiguration.name ?? 'Unknown Service'}
      />
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
