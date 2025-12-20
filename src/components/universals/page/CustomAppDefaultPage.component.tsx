import React, { PropsWithChildren } from 'react';
import { getCurrentServiceBaseConfiguration } from "@/utils/configuration.utils";
import { AutoNavigation } from "@/components/universals/page/AutoNavigation.component";
import styles from './DefaultPage.module.scss';
import { match } from 'path-to-regexp';
import memoize from 'lodash.memoize';
import clsx from 'clsx';
import DefaultPageHeader from "@/components/universals/page/DefaultPageHeader.component";
import { TCustomAppConfig } from "@/components/apps/custom-app/custom-app.type";
import { navigationUtils } from "@/utils/app/navigation.utils";

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

  const navigations = await navigationUtils.getNavigationItems(config, 'sidebar');
  const bottomNavigations = await navigationUtils.getNavigationItems(config, 'sidebar-bottom');

  return (
    <div className={clsx(className, styles.root)}>
      <DefaultPageHeader
        className={styles.header}
        title={baseConfiguration.name ?? 'Unknown Service'}
      />
      {navigations ? (
        <nav className={styles.navigation}>
          <AutoNavigation
            items={navigations}
            bottomItems={bottomNavigations}
          />
        </nav>
      ) : null}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
