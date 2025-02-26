import React from 'react';
import { TThread } from "@/services/customer-communication/customer-communication.type";
import ListItem from "@/components/universals/list/ListItem";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { DataTableDto } from "@/services/datatable/datatable.type";

type DataTableListItemProps = {
  dataTable: DataTableDto;
};

const DataTableListItem: React.FunctionComponent<DataTableListItemProps> = async ({
  dataTable,
}) => {
  return (
    <Link
      href={await getServiceLocalUrl(`/datatables/${dataTable.id}`)}
    >
      <ListItem>
        <div>
          {dataTable.name}
        </div>
      </ListItem>
    </Link>
  );
};

export default DataTableListItem;
