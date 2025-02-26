import { catalogService } from "@/services/product/catalog.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import { localizationService } from "@/services/product/localization.service";
import LocalizationCreateForm from "@/components/apps/product/localization/LocalizationCreateForm";
import Section from "@/components/universals/section/Section";
import CatalogCreateForm from "@/components/apps/product/catalog/CatalogCreateForm";

export default async function Home() {
  const catalogs = await catalogService.listCatalogs();
  const localizations = await localizationService.listLocalizations();

  return (
    <main>
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

      <Section name="Lokalisierungen">
        <List>
          {localizations.map(async (localization) => (
            <Link
              key={localization.id}
              href={await getServiceLocalUrl(`/localizations/${localization.id}`)}
            >
              <ListItem>
                {localization.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Lokalisierung erstellen">
        <LocalizationCreateForm />
      </Section>
    </main>
  );
}
