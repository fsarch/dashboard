import List from "@/components/universals/list/List";
import DataTableListItem from "@/components/apps/datatable/datatable-list/DataTableListItem";
import ListItem from "@/components/universals/list/ListItem";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import { functionService } from "@/services/function/function.service";
import Section from "@/components/universals/section/Section";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { FUNCTION_CREATE_FORM } from "@/app/(with-header)/function/[serviceId]/function/_forms/create-function.form";

export default async function Home() {
  const functions = await functionService.listFunctions();

  return (
    <DefaultPage>
      <Section name="Funktionen">
        <List>
          {functions.map(async (fnc) => (
            <Link
              key={fnc.id}
              href={await getServiceLocalUrl(`/function/${fnc.id}`)}
            >
              <ListItem>
                {fnc.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Funktion erstellen">
        <GeneratedForm
          definition={FUNCTION_CREATE_FORM}
        />
      </Section>
    </DefaultPage>
  );
}
