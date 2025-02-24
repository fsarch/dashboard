import TileList from "@/components/universals/tile-list/TileList";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import Link from "next/link";

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
}]

export default async function Home() {
  return (
    <main>
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
    </main>
  );
}
