import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import SearchInput from '@/components/universals/forms/SearchInput.component';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { buildPartTypeCreateForm } from '@/services/material-tracing/part-type.forms';
import { partTypeService } from '@/services/material-tracing/part-type.service';
import { EServiceType } from '@/utils/configuration.type';
import { getCurrentServiceBaseConfiguration } from '@/utils/configuration.utils';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

export default async function Home({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;

  const partTypesResult = await partTypeService.listPartTypes({
    search,
    skip: 0,
    take: 1000,
  });

  const serviceConfiguration = await getCurrentServiceBaseConfiguration();
  const productOptions =
    serviceConfiguration.type === EServiceType.MATERIAL_TRACING
      ? serviceConfiguration.options?.product
      : undefined;

  return (
    <DefaultPage>
      <Section name="Bauteil-Typ erstellen">
        <GeneratedForm definition={buildPartTypeCreateForm(productOptions)} />
      </Section>
      <Section name="Bauteil-Typen">
        <SearchInput />
        <List>
          {partTypesResult.data.map(async (partType) => (
            <LinkListItem
              key={partType.id}
              href={await getServiceLocalUrl(`/part-type/${partType.id}`)}
            >
              {partType.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}
