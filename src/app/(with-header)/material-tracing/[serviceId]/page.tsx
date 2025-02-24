import Link from "next/link";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import TileList from "@/components/universals/tile-list/TileList";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

export default async function Home() {
  return (
    <main>
      <TileList>
        <Link
          href={getServiceLocalUrl("/manufacturer")}
        >
          <TileListItem
            name="Manufacturers"
          />
        </Link>
        <Link
          href={getServiceLocalUrl("/material-type")}
        >
          <TileListItem
            name="Material Types"
          />
        </Link>
      </TileList>
    </main>
  );
}
