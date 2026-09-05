import TileList from "@/components/universals/tile-list/TileList";
import Section from "@/components/universals/section/Section";
import { getServiceConfigurations } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { getAccessToken } from "@/utils/getAccessToken";
import { decodeJwt } from "jose";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BackgroundOrbs from "@/components/universals/background-orbs/BackgroundOrbs.component";

import styles from './page.module.css';
import LinkTileListItem from "@/components/universals/tile-list/LinkTileListItem";
import { appUtils } from "@/utils/app/app.utils";
import { uacUtils } from "@/utils/uac.utils";
import SignOutButton from "@/components/navigation/SignOutButton";

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
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const data = decodeJwt(accessToken) as { given_name?: string; preferred_username: string; };
  const apps = await appUtils.getApps();
  const greeting = getGreetingByHour();
  const availableCustomApps = (await Promise.all(
    customApps.map(async (app) => ({
      app,
      isAllowed: await uacUtils.hasAppPermission(EServiceType.CUSTOM_APP, app.id, accessToken),
    })),
  ))
    .filter(({ isAllowed }) => isAllowed)
    .map(({ app }) => app);

  return (
    <main className={styles.root}>
      <BackgroundOrbs />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>
          {greeting} <span className={styles.pageTitlePerson}>{data.given_name || data.preferred_username || ''}</span>!
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
