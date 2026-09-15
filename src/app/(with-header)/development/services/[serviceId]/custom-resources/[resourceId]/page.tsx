import { Metadata } from 'next';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { APPS } from '@/constants/apps';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import autoNavigationStyles from '@/components/universals/page/AutoNavigation.module.scss';
import Section from '@/components/universals/section/Section';
import { customResourcesUtils } from '@/utils/app/custom-resources';
import CustomResourceDetail from './_components/CustomResourceDetail.component';

export const metadata: Metadata = {
  title: 'Development – Custom Resource Details',
};

type CustomResourceDetailPageProps = {
  params: Promise<{ serviceId: string; resourceId: string }>;
};

export default async function CustomResourceDetailPage({ params }: CustomResourceDetailPageProps) {
  const { serviceId, resourceId } = await params;

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

  if (!APPS[service.type]?.supportsCustomResources) {
    return notFound();
  }

  let resource;
  try {
    resource = await customResourcesUtils.getCustomResourceById(serviceId, resourceId);
  } catch {
    return notFound();
  }
  if (!resource) {
    return notFound();
  }

  return (
    <div className={styles.root}>
      <DefaultPageHeader
        className={styles.header}
        title={`Custom Resource – ${resource.name}`}
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
              Custom Resources
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <Section name={`Custom Resource: ${resource.name}`}>
          <CustomResourceDetail resource={resource} serviceId={serviceId} />
        </Section>
      </main>
    </div>
  );
}
