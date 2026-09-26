import Link from 'next/link';
import type React from 'react';
import ListItem from '@/components/universals/list/ListItem';
import { TThread } from '@/services/customer-communication/customer-communication.type';
import type { DataTableDto } from '@/services/datatable/datatable.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type DataTableListItemProps = {
  dataTable: DataTableDto;
};

const DataTableListItem: React.FunctionComponent<
  DataTableListItemProps
> = async ({ dataTable }) => {
  return (
    <Link href={await getServiceLocalUrl(`/datatables/${dataTable.id}`)}>
      <ListItem>
        <div>{dataTable.name}</div>
      </ListItem>
    </Link>
  );
};

export default DataTableListItem;
