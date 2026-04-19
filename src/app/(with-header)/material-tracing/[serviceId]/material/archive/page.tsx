import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { materialService } from "@/services/material-tracing/material.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import MaterialsList from "@/components/apps/material-tracing/material/MaterialsList.component";
import {
  loadArchivedMaterialsAction,
} from "@/app/(with-header)/material-tracing/[serviceId]/material/archive/materials.server-action";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const materialsResult = await materialService.listMaterials({ isArchived: true, skip: 0, take: 25 });
  const materialsWithUrls = await Promise.all(
    materialsResult.data.map(async (material) => ({
      ...material,
      url: await getServiceLocalUrl(`/material/${material.id}`),
    })),
  );

  return (
    <DefaultPage>
      <Section name="Archivierte Materialien">
        <MaterialsList
          initialMaterials={materialsWithUrls}
          initialTotalItems={materialsResult.metadata.totalItems}
          fetchMaterials={loadArchivedMaterialsAction}
        />
      </Section>
    </DefaultPage>
  );
}

