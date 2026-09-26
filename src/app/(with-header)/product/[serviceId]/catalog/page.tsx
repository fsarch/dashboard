import Link from 'next/link';
import CatalogCreateForm from '@/components/apps/product/catalog/CatalogCreateForm';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { catalogService } from '@/services/product/catalog.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

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
              <ListItem>{catalog.name}</ListItem>
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
