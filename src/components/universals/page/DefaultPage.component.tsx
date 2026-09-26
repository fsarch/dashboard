import clsx from 'clsx';
import jsonata from 'jsonata';
import memoize from 'lodash.memoize';
import { headers } from 'next/headers';
import { match } from 'path-to-regexp';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import BackgroundOrbs from '@/components/universals/background-orbs/BackgroundOrbs.component';
import { AutoFloatingButton } from '@/components/universals/floating-button/AutoFloatingButton.component';
import { normalizeFloatingButtons } from '@/components/universals/floating-button/floatingButton.helpers';
import { TIcon } from '@/components/universals/icon/Icon.type';
import { AutoNavigation } from '@/components/universals/page/AutoNavigation.component';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import { APPS } from '@/constants/apps';
import { floatingButtonUtils } from '@/utils/app/floatingButton.utils';
import { navigationUtils } from '@/utils/app/navigation.utils';
import { getCurrentServiceBaseConfiguration } from '@/utils/configuration.utils';
import styles from './DefaultPage.module.scss';

type DefaultPageProps = PropsWithChildren<{
  className?: string;
}>;

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
  const navigations = await navigationUtils.getNavigationItems(
    config,
    'sidebar',
  );
  const bottomNavigationItems = await navigationUtils.getNavigationItems(
    config,
    'sidebar-bottom',
  );
  const floatingButton = await floatingButtonUtils.getFloatingButton(config);
  const hasFloatingButton = normalizeFloatingButtons(floatingButton).length > 0;

  return (
    <div
      className={clsx(
        className,
        styles.root,
        !navigations && styles.rootNoNavigation,
        hasFloatingButton && styles.rootWithFloatingButton,
      )}
    >
      <BackgroundOrbs animated={false} />
      <DefaultPageHeader
        className={styles.header}
        title={baseConfiguration.name ?? 'Unknown Service'}
      />
      {navigations || bottomNavigationItems ? (
        <nav className={styles.navigation}>
          <AutoNavigation
            items={navigations}
            bottomItems={bottomNavigationItems}
          />
        </nav>
      ) : null}
      <main className={styles.main}>{children}</main>
      <AutoFloatingButton floatingButton={floatingButton} />
    </div>
  );
};
