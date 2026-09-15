import { Metadata } from 'next';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { EServiceType } from '@/utils/configuration.type';
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

type GlobalCustomResourceDetailPageProps = {
  params: Promise<{ appType: string; resourceId: string }>;
};

export default async function GlobalCustomResourceDetailPage({ params }: GlobalCustomResourceDetailPageProps) {
  const { appType, resourceId } = await params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return notFound();
  }

  if (!(Object.values(EServiceType) as string[]).includes(appType)) {
    return notFound();
  }

  const definition = await customResourcesUtils.getCustomResourceDefinitionForAppType(
    appType as EServiceType,
    resourceId,
  );
  if (!definition) {
    return notFound();
  }

  const { resource } = definition;

  return (
    <div className={styles.root}>
      <DefaultPageHeader
        className={styles.header}
        title={`Custom Resource – ${appType}.${resource.id}`}
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
            <AutoNavigationItem href="/development/custom-resources" isSelected icon="cubes">
              Custom Resources
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <Section name={`Custom Resource: ${appType}.${resource.id}`}>
          <CustomResourceDetail appType={appType as EServiceType} resource={resource} />
        </Section>
      </main>
    </div>
  );
}
