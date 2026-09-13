import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import NavigationTileList from "@/components/universals/page/navigation/tile-list/NavigationTileList.component";
import { APPS } from "@/constants/apps";
import { EServiceType } from "@/utils/configuration.type";
import { navigationUtils } from "@/utils/app/navigation.utils";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const navigation = await navigationUtils.getNavigationItems(APPS[EServiceType.MATERIAL_TRACING], 'sidebar');

  return (
    <DefaultPage>
      <NavigationTileList
        navigation={navigation ?? []}
      />
    </DefaultPage>
  );
}
