import Link from 'next/link';
import { ManufacturerCreateForm } from '@/components/apps/material-tracing/manufacturer/ManufacturerCreateForm.component';
import SearchInput from '@/components/universals/forms/SearchInput.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { manufacturerService } from '@/services/material-tracing/manufacturer.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

export default async function Home({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;

  const manufacturersResult = await manufacturerService.listManufacturers({
    search,
    skip: 0,
    take: 1000,
  });

  return (
    <DefaultPage>
      <Section name="Hersteller erstellen">
        <ManufacturerCreateForm />
      </Section>
      <Section name="Hersteller">
        <SearchInput />
        <List>
          {manufacturersResult.data.map(async (manufacturer: any) => (
            <Link
              key={manufacturer.id}
              href={
                await getServiceLocalUrl(`/manufacturer/${manufacturer.id}`)
              }
            >
              <ListItem>{manufacturer.name}</ListItem>
            </Link>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}
