import Link from "next/link";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import TileList from "@/components/universals/tile-list/TileList";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import ShortCodeScannerBanner
  from "@/app/(with-header)/material-tracing/[serviceId]/_components/ShortCodeScannerBanner.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  return (
    <main>
      <ShortCodeScannerBanner/>
      <TileList>
        <Link
          href={await getServiceLocalUrl("/manufacturer")}
        >
          <TileListItem
            name="Manufacturers"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/material-type")}
        >
          <TileListItem
            name="Material Types"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/material")}
        >
          <TileListItem
            name="Materials"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/part-type")}
        >
          <TileListItem
            name="Part Types"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/part")}
        >
          <TileListItem
            name="Part"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/short-code")}
        >
          <TileListItem
            name="Short Codes"
          />
        </Link>
      </TileList>
    </main>
  );
}
