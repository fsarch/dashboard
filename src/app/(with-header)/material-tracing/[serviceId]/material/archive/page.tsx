import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { materialService } from "@/services/material-tracing/material.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const materialsResult = await materialService.listMaterials({ isArchived: true, skip: 0, take: 1000 });

  return (
    <DefaultPage>
      <Section name="Archivierte Materialien">
        <List>
          {materialsResult.data.map(async (material) => (
            <LinkListItem href={await getServiceLocalUrl(`/material/${material.id}`)} key={material.id}>
              {material.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

