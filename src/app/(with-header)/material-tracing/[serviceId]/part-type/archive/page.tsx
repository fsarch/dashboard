import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { partTypeService } from "@/services/material-tracing/part-type.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const partTypesResult = await partTypeService.listPartTypes({ isArchived: true, skip: 0, take: 1000 });

  return (
    <DefaultPage>
      <Section name="Archivierte Bauteil-Typen">
        <List>
          {partTypesResult.data.map(async (partType) => (
            <LinkListItem href={await getServiceLocalUrl(`/part-type/${partType.id}`)} key={partType.id}>
              {partType.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

