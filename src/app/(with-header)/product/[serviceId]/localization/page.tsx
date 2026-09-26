import Link from 'next/link';
import LocalizationCreateForm from '@/components/apps/product/localization/LocalizationCreateForm';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { localizationService } from '@/services/product/localization.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export default async function Home({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) {
  const localizations = await localizationService.listLocalizations();
  const catalogId = (await params).catalogId;

  return (
    <DefaultPage>
      <Section name="Lokalisierungen">
        <List>
          {localizations.map(async (localization) => (
            <Link
              key={localization.id}
              href={
                await getServiceLocalUrl(`/localizations/${localization.id}`)
              }
            >
              <ListItem>{localization.name}</ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Lokalisierung erstellen">
        <LocalizationCreateForm catalogId={catalogId} />
      </Section>
    </DefaultPage>
  );
}
