import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import {
  ManufacturerCreateForm
} from "@/components/apps/material-tracing/manufacturer/ManufacturerCreateForm.component";

export default async function Home() {
  const manufacturers = await manufacturerService.listManufacturers();

  return (
    <main>
      <Section name="Manufacturers">
        <List>
          {manufacturers.map((manufacturer: any) => (
            <Link
              key={manufacturer.id}
              href={getServiceLocalUrl(`/manufacturer/${manufacturer.id}`)}
            >
              <ListItem>
                {manufacturer.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Manufacturers erstellen">
        <ManufacturerCreateForm />
      </Section>
    </main>
  );
}
