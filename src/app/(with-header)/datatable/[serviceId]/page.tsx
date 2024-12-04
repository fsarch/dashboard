import { fetchService } from "@/utils/fetchService";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { customerCommunicationService } from "@/services/customer-communication/customer-communication.service";
import ThreadListItem from "@/components/apps/customer-communication/thread-list/ThreadListItem";
import { dataTableService } from "@/services/datatable/datatable.service";
import DataTableListItem from "@/components/apps/datatable/datatable-list/DataTableListItem";
import { headers } from "next/headers";

export default async function Home({ params }: { params: { serviceId: string } }) {
  const dataTables = await dataTableService.listDataTables();

  return (
    <div>
      DataTable-Overview
      <List>
        {dataTables.map((dataTable) => (
          <DataTableListItem
            key={dataTable.id}
            dataTable={dataTable}
          />
        ))}
      </List>
    </div>
  );
}
