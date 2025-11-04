import TileList from "@/components/universals/tile-list/TileList";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { getServiceConfigurations } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { TIcon } from "@/components/universals/icon/Icon.type";
import { getAccessToken } from "@/utils/getAccessToken";
import { decodeJwt } from "jose";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import styles from './page.module.css';

const apps: Array<{ icon?: TIcon; name: string; path: string; }> = [{
  icon: 'tag',
  name: 'Product',
  path: '/product',
}, {
  icon: 'table',
  name: 'DataTable',
  path: '/datatable',
}, {
  icon: 'message',
  name: 'Customer Communication',
  path: '/ccm',
}, {
  icon: 'image',
  name: 'Image Server',
  path: '/image',
}, {
  icon: 'industry',
  name: 'Material Tracing',
  path: '/material-tracing',
}, {
  icon: 'file-pdf',
  name: 'PDF Render',
  path: '/pdf-render',
}, {
  icon: 'code',
  name: 'Functions',
  path: '/function',
}, {
  icon: 'print',
  name: 'Printer',
  path: '/printer',
}]

export default async function Home() {
  const customApps = await getServiceConfigurations(EServiceType.CUSTOM_APP);

  const accessToken = await getAccessToken();
  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const data = decodeJwt(accessToken) as { given_name?: string; preferred_username: string; };


  return (
    <main className={styles.root}>
      <h1 className={styles.pageTitle}>
        Hallo <span className={styles.pageTitlePerson}>{data.given_name || data.preferred_username || ''}</span>!
      </h1>
      <Section name="Apps">
        <nav>
          <TileList>
            {apps.map((app) => (
              <Link
                key={app.path}
                href={app.path}
              >
                <TileListItem
                  name={app.name}
                  icon={app.icon}
                />
              </Link>
            ))}
          </TileList>
        </nav>
      </Section>
      <Section name="Custom Apps">
        <nav>
          <TileList>
            {customApps.map((app) => (
              <Link
                key={app.id}
                href={`/custom-app/${app.id}`}
              >
                <TileListItem
                  name={app.name ?? app.id}
                />
              </Link>
            ))}
          </TileList>
        </nav>
      </Section>
    </main>
  );
}
