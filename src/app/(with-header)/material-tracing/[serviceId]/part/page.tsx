import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import Link from "next/link";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { partService } from "@/services/material-tracing/part.service";
import { PART_CREATE_FORM } from "@/services/material-tracing/part.forms";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const parts = await partService.listParts();

  return (
    <DefaultPage>
      <Section name="Part-Types">
        <List>
          {parts.map(async (part) => (
            <Link
              key={part.id}
              href={await getServiceLocalUrl(`/part/${part.id}`)}
            >
              <ListItem>
                {part.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="PartType erstellen">
        <GeneratedForm
          definition={PART_CREATE_FORM}
        />
      </Section>
    </DefaultPage>
  );
}
