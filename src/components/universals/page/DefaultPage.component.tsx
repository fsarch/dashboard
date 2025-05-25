import React, { PropsWithChildren } from 'react';
import Header from "@/components/navigation/Header";
import { getCurrentServiceBaseConfiguration } from "@/utils/configuration.utils";
import { SERVICES } from "@/constants/services";
import { AutoNavigation } from "@/components/universals/page/AutoNavigation.component";
import styles from './DefaultPage.module.scss';

type DefaultPageProps = PropsWithChildren<{

}>;

export const DefaultPage: React.FunctionComponent<DefaultPageProps> = async ({
  children,
}) => {
  let baseConfiguration;
  try {
    baseConfiguration = await getCurrentServiceBaseConfiguration();
  } catch {
    return children;
  }

  const config = SERVICES[baseConfiguration.type];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Header title={baseConfiguration.name ?? 'Unknown Service'}/>
      </header>
      {config.navigation ? (
        <nav className={styles.navigation}>
          <AutoNavigation
            navigation={config.navigation}
          />
        </nav>
      ) : null}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
