import 'server-only';
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Section from '@/components/universals/section/Section';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import { EServiceType } from '@/utils/configuration.type';
import { getServiceConfigurations } from '@/utils/configuration.utils';
import { APPS } from '@/constants/apps';

type ServiceSelectionPageProps = {
  serviceType: EServiceType;
};

const ServiceSelectionPage = async ({
  serviceType,
}: ServiceSelectionPageProps) => {
  const services = await getServiceConfigurations(serviceType);
  const basePath = APPS[serviceType].basePath;

  if (services.length === 1) {
    return redirect(`${basePath}/${services[0].id}`);
  }

  return (
    <div>
      <DefaultPageHeader className={styles.header} title={APPS[serviceType].name} />
      <main className={styles.main}>
        <Section name="Services">
          {services.length > 0 ? (
            <List>
              {services.map((service) => (
                <Link key={service.id} href={`${basePath}/${service.id}`}>
                  <ListItem>{service.name || service.id}</ListItem>
                </Link>
              ))}
            </List>
          ) : (
            <p>No services configured.</p>
          )}
        </Section>
      </main>
    </div>
  );
};

export default ServiceSelectionPage;

