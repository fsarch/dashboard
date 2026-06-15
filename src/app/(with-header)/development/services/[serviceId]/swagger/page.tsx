import { Metadata } from 'next';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById, getThemeConfiguration } from '@/utils/configuration.utils';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import autoNavigationStyles from '@/components/universals/page/AutoNavigation.module.scss';
import SwaggerUIClient from './_components/SwaggerUIClient.component';
import Color from 'color';

export const metadata: Metadata = {
  title: 'Development – Swagger UI',
};

type SwaggerPageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function SwaggerPage({ params }: SwaggerPageProps) {
  const { serviceId } = await params;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return notFound();
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  const theme = await getThemeConfiguration();
  const themeMode: 'light' | 'dark' = Color(theme.backgroundColor.hex).isDark() ? 'dark' : 'light';

  return (
    <div className={styles.root}>
      <DefaultPageHeader
        className={styles.header}
        title={`Swagger UI – ${service.name ?? service.id}`}
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
              href={`/development/services/${serviceId}/swagger`}
              isSelected
              icon="file-code"
            >
              Swagger UI
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <SwaggerUIClient
          serviceId={serviceId}
          specUrl={`/api/v1/development/service-docs/${serviceId}`}
          themeMode={themeMode}
        />
      </main>
    </div>
  );
}

