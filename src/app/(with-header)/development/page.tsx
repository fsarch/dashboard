import { Metadata } from 'next';
import Section from '@/components/universals/section/Section';
import { getAccessToken } from '@/utils/getAccessToken';
import { uacUtils } from '@/utils/uac.utils';
import AccessTokenPanel from '@/app/(with-header)/development/_components/AccessTokenPanel.component';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import styles from '@/components/universals/page/DefaultPage.module.scss';
import DefaultPageHeader from '@/components/universals/page/DefaultPageHeader.component';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import autoNavigationStyles from '@/components/universals/page/AutoNavigation.module.scss';

export const metadata: Metadata = {
  title: 'Development',
};

export default async function DevelopmentPage() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return notFound();
  }

  return (
    <div className={styles.root}>
      <DefaultPageHeader className={styles.header} title="Development" />
      <nav className={styles.navigation}>
        <div className={autoNavigationStyles.root}>
          <ul className={autoNavigationStyles.main}>
            <AutoNavigationItem href="/development" isSelected icon="wrench">
              Access Token
            </AutoNavigationItem>
          </ul>
          <div className={autoNavigationStyles.spacer} />
          <ul className={autoNavigationStyles.bottom} />
        </div>
      </nav>
      <main className={styles.main}>
        <Section name="Development">
          <AccessTokenPanel accessToken={accessToken} />
        </Section>
      </main>
    </div>
  );
}
