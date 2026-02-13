import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import { partTypeService } from "@/services/material-tracing/part-type.service";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { PART_TYPE_CREATE_FORM } from "@/services/material-tracing/part-type.forms";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";
import SearchInput from "@/components/universals/forms/SearchInput.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;
  
  const partTypes = await partTypeService.listPartTypes({ search });

  return (
    <DefaultPage>
      <Section name="Bauteil-Typ erstellen">
        <GeneratedForm
          definition={PART_TYPE_CREATE_FORM}
        />
      </Section>
      <Section name="Bauteil-Typen">
        <SearchInput />
        <List>
          {partTypes.map(async (partType) => (
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
