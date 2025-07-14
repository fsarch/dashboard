import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import {
  ManufacturerCreateForm
} from "@/components/apps/material-tracing/manufacturer/ManufacturerCreateForm.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const manufacturers = await manufacturerService.listManufacturers();

  return (
    <DefaultPage>
      <Section name="Hersteller erstellen">
        <ManufacturerCreateForm />
      </Section>
      <Section name="Hersteller">
        <List>
          {manufacturers.map(async (manufacturer: any) => (
            <Link
              key={manufacturer.id}
              href={await getServiceLocalUrl(`/manufacturer/${manufacturer.id}`)}
            >
              <ListItem>
                {manufacturer.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}
