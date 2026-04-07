import { getServiceConfigurations } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { redirect } from 'next/navigation';
import { APPS } from '@/constants/apps';
import List from '@/components/universals/list/List';
import Link from 'next/link';
import ListItem from '@/components/universals/list/ListItem';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import React from 'react';
import Section from '@/components/universals/section/Section';

export default async function FrontierHome() {
  const foundServices = await getServiceConfigurations(EServiceType.FRONTIER);

  if (foundServices.length === 1) {
    return redirect(`${APPS[EServiceType.FRONTIER].basePath}/${foundServices[0].id}`);
  }

  return (
    <div>
      <DefaultPageHeader
        className={styles.header}
        title="Frontier"
      />
      <main className={styles.main}>
        <Section name="Services">
          <List>
            {foundServices.map((service) => (
              <Link
                key={service.id}
                href={`/frontier/${service.id}`}
              >
                <ListItem>
                  {service.name || service.id}
                </ListItem>
              </Link>
            ))}
          </List>
        </Section>
      </main>
    </div>
  );
}

