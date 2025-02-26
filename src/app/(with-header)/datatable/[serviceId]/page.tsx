import List from "@/components/universals/list/List";
import { dataTableService } from "@/services/datatable/datatable.service";
import DataTableListItem from "@/components/apps/datatable/datatable-list/DataTableListItem";

export default async function Home() {
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
