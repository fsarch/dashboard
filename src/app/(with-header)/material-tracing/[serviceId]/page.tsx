import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import ShortCodeScannerBanner
  from "@/app/(with-header)/material-tracing/[serviceId]/_components/ShortCodeScannerBanner.component";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import NavigationTileList from "@/components/universals/page/navigation/tile-list/NavigationTileList.component";
import { SERVICES } from "@/constants/services";
import { EServiceType } from "@/utils/configuration.type";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  return (
    <DefaultPage>
      <ShortCodeScannerBanner/>
      <NavigationTileList
        navigation={SERVICES[EServiceType.MATERIAL_TRACING].navigation ?? []}
      />
    </DefaultPage>
  );
}
