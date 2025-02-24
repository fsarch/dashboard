import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import {
  ManufacturerCreateForm
} from "@/components/apps/material-tracing/manufacturer/ManufacturerCreateForm.component";
import {
  MaterialTypeCreateForm
} from "@/components/apps/material-tracing/material-type/MaterialTypeCreateForm.component";
import { materialTypeService } from "@/services/material-tracing/material-type.service";

export default async function Home() {
  const manufacturers = await manufacturerService.listManufacturers();
  const materialTypes = await materialTypeService.listMaterialTypes();

  return (
    <main>
      {manufacturers.map((manufacturer) => (
        <Section name={manufacturer.name} key={manufacturer.id}>
          <List>
            {materialTypes.filter(mat => mat.manufacturerId === manufacturer.id).map((materialType) => (
              <Link
                key={materialType.id}
                href={getServiceLocalUrl(`/material-type/${materialType.id}`)}
              >
                <ListItem>
                  {materialType.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Section>
      ))}
      <Section name="MaterialType erstellen">
        <MaterialTypeCreateForm />
      </Section>
    </main>
  );
}
