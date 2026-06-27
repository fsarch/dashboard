import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import { functionGatewayService } from "@/services/function-gateway/function-gateway.service";
import Section from "@/components/universals/section/Section";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { FUNCTION_GATEWAY_CREATE_FORM } from "./function-gateway/_forms/create-function-gateway.form";

export default async function Home() {
  const functions = await functionGatewayService.listFunctions();

  return (
    <DefaultPage>
      <Section name="Funktionen">
        <List>
          {functions.data.map(async (fnc) => (
            <Link
              key={fnc.id}
              href={await getServiceLocalUrl(`/function-gateway/${fnc.id}`)}
            >
              <ListItem>
                {fnc.name || fnc.functionId}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Funktion erstellen">
        <GeneratedForm
          definition={FUNCTION_GATEWAY_CREATE_FORM}
        />
      </Section>
    </DefaultPage>
  );
}
