import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { MaterialCreateForm } from "@/components/apps/material-tracing/material/MaterialCreateForm.component";
import { materialService } from "@/services/material-tracing/material.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";
import SearchInput from "@/components/universals/forms/SearchInput.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;
  
  const materials = await materialService.listMaterials({ search });

  return (
    <DefaultPage>
      <Section name="Material erstellen">
        <MaterialCreateForm/>
      </Section>
      <Section name="Materialien">
        <SearchInput />
        <List>
          {materials.map(async (material) => (
            <LinkListItem href={await getServiceLocalUrl(`/material/${material.id}`)} key={material.id}>
              {material.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}
