import { Metadata } from 'next';
import { getConfiguration } from '@/utils/configuration.utils';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import autoNavigationStyles from '@/components/universals/page/AutoNavigation.module.scss';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';

export const metadata: Metadata = {
  title: 'Development – Services',
};

export default async function DevelopmentServicesPage() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return notFound();
  }

  const configuration = await getConfiguration();
  const services = configuration.services;

  return (
    <div className={styles.root}>
      <DefaultPageHeader className={styles.header} title="Development" />
      <nav className={styles.navigation}>
        <div className={autoNavigationStyles.root}>
          <ul className={autoNavigationStyles.main}>
            <AutoNavigationItem href="/development" icon="wrench">
              Access Token
            </AutoNavigationItem>
            <AutoNavigationItem href="/development/services" isSelected icon="server">
              Services
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <Section name="Verbundene Services">
          <List>
            {services.map((service) => (
              <LinkListItem
                key={service.id}
                href={`/development/services/${service.id}`}
              >
                <strong>{service.name ?? service.id}</strong>
                {' '}
                <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
                  [{service.type}] — {service.id}
                </span>
              </LinkListItem>
            ))}
          </List>
          {services.length === 0 && (
            <p style={{ padding: '8px', opacity: 0.6 }}>
              Keine Services konfiguriert.
            </p>
          )}
        </Section>
      </main>
    </div>
  );
}

