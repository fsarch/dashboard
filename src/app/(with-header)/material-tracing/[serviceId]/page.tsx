import Link from "next/link";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import TileList from "@/components/universals/tile-list/TileList";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { materialService } from "@/services/material-tracing/material.service";
import Section from "@/components/universals/section/Section";
import ListItem from "@/components/universals/list/ListItem";
import List from "@/components/universals/list/List";
import { MaterialCreateForm } from "@/components/apps/material-tracing/material/MaterialCreateForm.component";

export default async function Home() {
  const materials = await materialService.listMaterials();

  return (
    <main>
      <TileList>
        <Link
          href={await getServiceLocalUrl("/manufacturer")}
        >
          <TileListItem
            name="Manufacturers"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/material-type")}
        >
          <TileListItem
            name="Material Types"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/part-type")}
        >
          <TileListItem
            name="Part Types"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/part")}
        >
          <TileListItem
            name="Part"
          />
        </Link>
        <Link
          href={await getServiceLocalUrl("/short-code")}
        >
          <TileListItem
            name="Short Codes"
          />
        </Link>
      </TileList>
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
    </main>
  );
}
