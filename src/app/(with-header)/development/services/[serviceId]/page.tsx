import { Metadata } from 'next';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import autoNavigationStyles from '@/components/universals/page/AutoNavigation.module.scss';
import Section from '@/components/universals/section/Section';
import ServiceDetailClient from './_components/ServiceDetailClient.component';

export const metadata: Metadata = {
  title: 'Development – Service Details',
};

type ServiceDetailPageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
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
        <Section name={`Service: ${service.name ?? service.id}`}>
          <ServiceDetailClient service={service} />
        </Section>
      </main>
    </div>
  );
}

