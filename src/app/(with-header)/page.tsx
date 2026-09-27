import { decodeJwt } from 'jose';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import EnvironmentSwitcher from '@/components/navigation/EnvironmentSwitcher';
import { getSelectedEnvironment } from '@/components/navigation/EnvironmentSwitcher.server-action';
import SignOutButton from '@/components/navigation/SignOutButton';
import BackgroundOrbs from '@/components/universals/background-orbs/BackgroundOrbs.component';
import Section from '@/components/universals/section/Section';
import LinkTileListItem from '@/components/universals/tile-list/LinkTileListItem';
import TileList from '@/components/universals/tile-list/TileList';
import { appUtils } from '@/utils/app/app.utils';
import { EServiceType } from '@/utils/configuration.type';
import {
  getGlobalEnvironmentSwitcherOptions,
  getServiceConfigurations,
} from '@/utils/configuration.utils';
import { getAccessToken } from '@/utils/getAccessToken';
import { uacUtils } from '@/utils/uac.utils';
import styles from './page.module.css';

function getGreetingByHour(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 5) {
    return 'Gute Nacht';
  }

  if (hour < 11) {
    return 'Guten Morgen';
  }

  if (hour < 18) {
    return 'Guten Tag';
  }

  return 'Guten Abend';
}

export default async function Home() {
  const customApps = await getServiceConfigurations(EServiceType.CUSTOM_APP);

  const accessToken = await getAccessToken();
  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  const data = decodeJwt(accessToken) as {
    given_name?: string;
    preferred_username: string;
  };
  const greeting = getGreetingByHour();

  const selectedEnvironment = await getSelectedEnvironment();
  const environmentSwitcherConfiguration =
    await getGlobalEnvironmentSwitcherOptions(selectedEnvironment);
  const environmentFilter =
    environmentSwitcherConfiguration?.currentEnvironmentId;

  const apps = await appUtils.getApps(environmentFilter);

  const availableCustomApps = (
    await Promise.all(
      customApps
        .filter((app) =>
          environmentFilter ? app.environment === environmentFilter : true,
        )
        .map(async (app) => ({
          app,
          isAllowed: await uacUtils.hasAppPermission(
            EServiceType.CUSTOM_APP,
            app.id,
            accessToken,
          ),
        })),
    )
  )
    .filter(({ isAllowed }) => isAllowed)
    .map(({ app }) => app);

  return (
    <main className={styles.root}>
      <BackgroundOrbs />
      {environmentSwitcherConfiguration && (
        <div className={styles.environmentSwitcher}>
          <EnvironmentSwitcher
            configuration={environmentSwitcherConfiguration}
            variant="plain"
          />
        </div>
      )}
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>
          {greeting}{' '}
          <span className={styles.pageTitlePerson}>
            {data.given_name || data.preferred_username || ''}
          </span>
          !
        </h1>
        <div className={styles.actions}>
          <SignOutButton />
        </div>
        <Section name="Apps" transparent>
          <nav>
            <TileList>
              {apps.map((app) => (
                <LinkTileListItem
                  key={app.path}
                  href={app.path}
                  name={app.name}
                  icon={app.icon}
                  transparent
                />
              ))}
            </TileList>
          </nav>
        </Section>
        <Section name="Custom Apps" transparent>
          <nav>
            <TileList>
              {availableCustomApps.map((app) => (
                <LinkTileListItem
                  key={app.id}
                  href={`/custom-app/${app.id}`}
                  name={app.name ?? app.id}
                  transparent
                />
              ))}
            </TileList>
          </nav>
        </Section>
      </div>
    </main>
  );
}
