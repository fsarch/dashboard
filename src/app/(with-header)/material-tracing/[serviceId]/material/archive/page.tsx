import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { materialService } from "@/services/material-tracing/material.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const materials = await materialService.listMaterials({ isArchived: true });

  return (
    <DefaultPage>
      <Section name="Archivierte Materialien">
        <List>
          {materials.map(async (material) => (
            <Link href={await getServiceLocalUrl(`/material/${material.id}`)} key={material.id}>
              <ListItem>
                {material.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

