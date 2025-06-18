import List from "@/components/universals/list/List";
import DataTableListItem from "@/components/apps/datatable/datatable-list/DataTableListItem";
import ListItem from "@/components/universals/list/ListItem";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import { functionService } from "@/services/function/function.service";

export default async function Home() {
  const functions = await functionService.listFunctions();

  return (
    <DefaultPage>
      Function-Overview
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
    </DefaultPage>
  );
}
