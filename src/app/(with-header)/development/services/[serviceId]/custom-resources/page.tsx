import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import autoNavigationStyles from '@/components/universals/page/AutoNavigation.module.scss';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import Section from '@/components/universals/section/Section';
import { APPS } from '@/constants/apps';
import { customResourcesUtils } from '@/utils/app/custom-resources';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { getAccessToken } from '@/utils/getAccessToken';
import { uacUtils } from '@/utils/uac.utils';

export const metadata: Metadata = {
  title: 'Development – Custom Resources',
};

type CustomResourcesPageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function CustomResourcesPage({
  params,
}: CustomResourcesPageProps) {
  const { serviceId } = await params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return notFound();
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  // Defense in depth: die UI verlinkt nur hierher, wenn der App-Typ das unterstützt.
  if (!APPS[service.type]?.supportsCustomResources) {
    return notFound();
  }

  let resources: Awaited<
    ReturnType<typeof customResourcesUtils.listCustomResources>
  > = [];
  let loadError = false;
  try {
    resources = await customResourcesUtils.listCustomResources(serviceId);
  } catch {
    loadError = true;
  }

  return (
    <div className={styles.root}>
      <DefaultPageHeader
        className={styles.header}
        title={`Custom Resources – ${service.name ?? service.id}`}
      />
      <nav className={styles.navigation}>
        <div className={autoNavigationStyles.root}>
          <ul className={autoNavigationStyles.main}>
            <AutoNavigationItem href="/development" icon="wrench">
              Access Token
            </AutoNavigationItem>
            <AutoNavigationItem href="/development/services" icon="server">
              Services
            </AutoNavigationItem>
            <AutoNavigationItem
              href={`/development/services/${serviceId}/custom-resources`}
              isSelected
              icon="cubes"
            >
              Custom Resources ({service.name ?? service.id})
            </AutoNavigationItem>
            <AutoNavigationItem
              href="/development/custom-resources"
              icon="cubes"
            >
              Custom Resources
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <Section name="Custom Resources">
          {loadError && (
            <p style={{ padding: '8px', opacity: 0.6 }}>
              Custom Resources konnten nicht geladen werden. Ist das Backend
              erreichbar und implementiert es den Endpunkt{' '}
              <code>/v1/.meta/custom-resources</code>?
            </p>
          )}
          {!loadError && (
            <>
              <List>
                {resources.map((resource) => (
                  <LinkListItem
                    key={resource.id}
                    href={`/development/services/${serviceId}/custom-resources/${resource.id}`}
                  >
                    <strong>{resource.name}</strong>{' '}
                    <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
                      [{resource.id}] — {resource.description}
                    </span>
                  </LinkListItem>
                ))}
              </List>
              {resources.length === 0 && (
                <p style={{ padding: '8px', opacity: 0.6 }}>
                  Keine Custom Resources vorhanden.
                </p>
              )}
            </>
          )}
        </Section>
      </main>
    </div>
  );
}
