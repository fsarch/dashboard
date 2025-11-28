import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import { localizationService } from "@/services/product/localization.service";
import LocalizationCreateForm from "@/components/apps/product/localization/LocalizationCreateForm";
import Section from "@/components/universals/section/Section";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home({ params }: { params: Promise<{ catalogId: string }>; }) {
  const localizations = await localizationService.listLocalizations();
  const catalogId = (await params).catalogId;

  return (
    <DefaultPage>
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
        <LocalizationCreateForm
          catalogId={catalogId}
        />
      </Section>
    </DefaultPage>
  );
}
