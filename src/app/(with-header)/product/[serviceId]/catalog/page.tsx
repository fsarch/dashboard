import { catalogService } from "@/services/product/catalog.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import CatalogCreateForm from "@/components/apps/product/catalog/CatalogCreateForm";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home() {
  const catalogs = await catalogService.listCatalogs();

  return (
    <DefaultPage>
      <Section name="Kataloge">
        <List>
          {catalogs.map(async (catalog) => (
            <Link
              key={catalog.id}
              href={await getServiceLocalUrl(`/catalog/${catalog.id}`)}
            >
              <ListItem>
                {catalog.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Katalog erstellen">
        <CatalogCreateForm />
      </Section>
    </DefaultPage>
  );
}
