import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { partTypeService } from "@/services/material-tracing/part-type.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const partTypes = await partTypeService.listPartTypes({ isArchived: true });

  return (
    <DefaultPage>
      <Section name="Archivierte Bauteil-Typen">
        <List>
          {partTypes.map(async (partType) => (
            <Link href={await getServiceLocalUrl(`/part-type/${partType.id}`)} key={partType.id}>
              <ListItem>
                {partType.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

