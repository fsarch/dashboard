import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const manufacturersResult = await manufacturerService.listManufacturers({ skip: 0, take: 1000 });
  const materialTypesResult = await materialTypeService.listMaterialTypes({ isArchived: true, skip: 0, take: 1000 });

  return (
    <DefaultPage>
      <h2>Archivierte Material-Types</h2>
      {manufacturersResult.data.map((manufacturer) => (
        <Section name={manufacturer.name} key={manufacturer.id}>
          <List>
            {materialTypesResult.data.filter(mat => mat.manufacturerId === manufacturer.id).map(async (materialType) => (
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

