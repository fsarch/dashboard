import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { MaterialCreateForm } from "@/components/apps/material-tracing/material/MaterialCreateForm.component";
import { materialService } from "@/services/material-tracing/material.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import SearchInput from "@/components/universals/forms/SearchInput.component";
import MaterialsList from "@/components/apps/material-tracing/material/MaterialsList.component";
import { loadMaterialsAction } from "@/app/(with-header)/material-tracing/[serviceId]/material/materials.server-action";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;

  const materialsResult = await materialService.listMaterials({ search, skip: 0, take: 25 });
  const materialsWithUrls = await Promise.all(
    materialsResult.data.map(async (material) => ({
      ...material,
      url: await getServiceLocalUrl(`/material/${material.id}`),
    })),
  );

  return (
    <DefaultPage>
      <Section name="Material erstellen">
        <MaterialCreateForm/>
      </Section>
      <Section name="Materialien">
        <SearchInput />
        <MaterialsList
          initialMaterials={materialsWithUrls}
          initialTotalItems={materialsResult.metadata.totalItems}
          fetchMaterials={loadMaterialsAction}
          search={search}
        />
      </Section>
    </DefaultPage>
  );
}
