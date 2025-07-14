import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { MaterialCreateForm } from "@/components/apps/material-tracing/material/MaterialCreateForm.component";
import { materialService } from "@/services/material-tracing/material.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const materials = await materialService.listMaterials();

  return (
    <DefaultPage>
      <Section name="Material erstellen">
        <MaterialCreateForm/>
      </Section>
      <Section name="Materialien">
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
