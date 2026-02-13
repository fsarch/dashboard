import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import {
  MaterialTypeCreateForm
} from "@/components/apps/material-tracing/material-type/MaterialTypeCreateForm.component";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";
import SearchInput from "@/components/universals/forms/SearchInput.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;
  
  const manufacturers = await manufacturerService.listManufacturers({ search });
  const materialTypes = await materialTypeService.listMaterialTypes({ search });

  return (
    <DefaultPage>
      <Section name="MaterialType erstellen">
        <MaterialTypeCreateForm />
      </Section>
      <Section name="Material-Typen">
        <SearchInput />
      </Section>
      {manufacturers.map((manufacturer) => (
        <Section name={manufacturer.name} key={manufacturer.id}>
          <List>
            {materialTypes.filter(mat => mat.manufacturerId === manufacturer.id).map(async (materialType) => (
              <LinkListItem
                key={materialType.id}
                href={await getServiceLocalUrl(`/material-type/${materialType.id}`)}
              >
                {materialType.name}
              </LinkListItem>
            ))}
          </List>
        </Section>
      ))}
    </DefaultPage>
  );
}
