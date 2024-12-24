import { catalogService } from "@/services/product/catalog.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import { localizationService } from "@/services/product/localization.service";
import LocalizationCreateForm from "@/components/apps/product/localization/LocalizationCreateForm";

export default async function Home() {
  const catalogs = await catalogService.listCatalogs();
  const localizations = await localizationService.listLocalizations();

  return (
    <main>
      <h2>Catalogs</h2>
      <List>
        {catalogs.map((catalog) => (
          <Link
            key={catalog.id}
            href={getServiceLocalUrl(`/catalog/${catalog.id}`)}
          >
            <ListItem>
              {catalog.name}
            </ListItem>
          </Link>
        ))}
      </List>
      <h2>Localizations</h2>
      <List>
        {localizations.map((localization) => (
          <Link
            key={localization.id}
            href={getServiceLocalUrl(`/localizations/${localization.id}`)}
          >
            <ListItem>
              {localization.name}
            </ListItem>
          </Link>
        ))}
      </List>
      <LocalizationCreateForm />
    </main>
  );
}
