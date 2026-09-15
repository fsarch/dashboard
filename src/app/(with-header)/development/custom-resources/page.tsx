import { Metadata } from 'next';
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
import { customResourcesUtils } from '@/utils/app/custom-resources';

export const metadata: Metadata = {
  title: 'Development – Custom Resources',
};

export default async function GlobalCustomResourcesPage() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return notFound();
  }

  const definitions = await customResourcesUtils.listAllCustomResourceDefinitions();

  return (
    <div className={styles.root}>
      <DefaultPageHeader className={styles.header} title="Development" />
      <nav className={styles.navigation}>
        <div className={autoNavigationStyles.root}>
          <ul className={autoNavigationStyles.main}>
            <AutoNavigationItem href="/development" icon="wrench">
              Access Token
            </AutoNavigationItem>
            <AutoNavigationItem href="/development/services" icon="server">
              Services
            </AutoNavigationItem>
            <AutoNavigationItem href="/development/custom-resources" isSelected icon="cubes">
              Custom Resources
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <Section name="Custom Resources (alle Services)">
          <List>
            {definitions.map(({ appType, resource }) => (
              <LinkListItem
                key={`${appType}.${resource.id}`}
                href={`/development/custom-resources/${appType}/${resource.id}`}
              >
                <strong>{appType}.{resource.id}</strong>
                {' '}
                <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
                  {resource.name} — {resource.description}
                </span>
              </LinkListItem>
            ))}
          </List>
          {definitions.length === 0 && (
            <p style={{ padding: '8px', opacity: 0.6 }}>
              Keine Custom Resources vorhanden.
            </p>
          )}
        </Section>
      </main>
    </div>
  );
}
