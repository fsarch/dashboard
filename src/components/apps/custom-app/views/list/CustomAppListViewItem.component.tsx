import React from 'react';
import { TCustomAppClickHandler, TListView, TListViewItem } from "@/components/apps/custom-app/custom-app.type";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import Link from 'next/link';
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import jsonata from "jsonata";

type CustomAppListViewItemProps = {
  item: TListViewItem;
  click: TCustomAppClickHandler;
};

const CustomAppListViewItem: React.FunctionComponent<CustomAppListViewItemProps> = async ({
  item,
  click,
}) => {
  if (click.$type === 'open-service-view') {
    const path = await (jsonata(click.path.value).evaluate({
      value: item.value,
    }));

    return (
      <Link href={await getServiceLocalUrl(path)}>
        <ListItem>
          {item.label}
        </ListItem>
      </Link>
    );
  }

  return (
    <ListItem>
      {item.label}
    </ListItem>
  );
};

export default CustomAppListViewItem;
