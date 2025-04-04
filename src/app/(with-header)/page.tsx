import TileList from "@/components/universals/tile-list/TileList";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { getServiceConfigurations } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";

const apps = [{
  name: 'Product',
  path: '/product',
}, {
  name: 'DataTable',
  path: '/datatable',
}, {
  name: 'Customer Communication',
  path: '/ccm',
}, {
  name: 'Image Server',
  path: '/image',
}, {
  name: 'Material Tracing',
  path: '/material-tracing',
}, {
  name: 'PDF Render',
  path: '/pdf-render',
}]

export default async function Home() {
  const customApps = await getServiceConfigurations(EServiceType.CUSTOM_APP);

  return (
    <main>
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
