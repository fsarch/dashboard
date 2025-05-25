import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { MaterialCreateForm } from "@/components/apps/material-tracing/material/MaterialCreateForm.component";
import { materialService } from "@/services/material-tracing/material.service";

export default async function Home() {
  const materials = await materialService.listMaterials();

  return (
    <>
      <Section name="Materials">
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
      <Section name="Material erstellen">
        <MaterialCreateForm/>
      </Section>
    </>
  );
}
