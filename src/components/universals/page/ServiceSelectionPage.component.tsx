import 'server-only';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

import { getSelectedEnvironment } from '@/components/navigation/EnvironmentSwitcher.server-action';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import Section from '@/components/universals/section/Section';
import { APPS } from '@/constants/apps';
import type { EServiceType } from '@/utils/configuration.type';
import {
  getConfiguration,
  getEnvironmentSwitcherOptionsForType,
  getServiceConfigurations,
} from '@/utils/configuration.utils';

type ServiceSelectionPageProps = {
  serviceType: EServiceType;
};

const ServiceSelectionPage = async ({
  serviceType,
}: ServiceSelectionPageProps) => {
  const selectedEnvironment = await getSelectedEnvironment();
  const environmentSwitcherConfiguration =
    await getEnvironmentSwitcherOptionsForType(
      serviceType,
      selectedEnvironment,
    );
  // Resolved by getEnvironmentSwitcherOptionsForType from the cookie above,
  // falling back to the first configured environment - so the list below
  // and the switcher's shown selection always agree, even on a first-ever
  // visit with no cookie set yet. Undefined only when no environments are
  // configured for this service type at all, in which case nothing is
  // filtered (unchanged pre-environments behavior).
  const environmentFilter =
    environmentSwitcherConfiguration?.currentEnvironmentId;

  const allServices = await getServiceConfigurations(serviceType);
  const services = environmentFilter
    ? allServices.filter((s) => s.environment === environmentFilter)
    : allServices;
  const basePath = APPS[serviceType].basePath;
  const environments = (await getConfiguration()).environments;

  if (services.length === 1) {
    return redirect(`${basePath}/${services[0].id}`);
  }

  return (
    <div>
      <DefaultPageHeader
        className={styles.header}
        title={APPS[serviceType].name}
        environmentSwitcherConfiguration={environmentSwitcherConfiguration}
      />
      <main className={styles.main}>
        <Section name="Services">
          {services.length > 0 ? (
            <List>
              {services.map((service) => {
                const environmentName = service.environment
                  ? (environments?.find((e) => e.id === service.environment)
                      ?.name ?? service.environment)
                  : undefined;

                return (
                  <Link key={service.id} href={`${basePath}/${service.id}`}>
                    <ListItem>
                      {service.name || service.id}
                      {environmentName ? ` (${environmentName})` : ''}
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          ) : (
            <p>
              {environmentFilter
                ? 'No services configured for this environment.'
                : 'No services configured.'}
            </p>
          )}
        </Section>
      </main>
    </div>
  );
};

export default ServiceSelectionPage;
