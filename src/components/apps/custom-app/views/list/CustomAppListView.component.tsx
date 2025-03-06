import React from 'react';
import { TListView, TListViewItem } from "@/components/apps/custom-app/custom-app.type";
import List from "@/components/universals/list/List";
import CustomAppListViewItem from "@/components/apps/custom-app/views/list/CustomAppListViewItem.component";

type CustomAppListViewProps = {
  view: TListView;
  dataSource: Record<string, unknown>;
};

const CustomAppListView: React.FunctionComponent<CustomAppListViewProps> = async ({
  dataSource,
  view,
}) => {

  if (view.data.$type === 'datasource') {
    view.data = {
      $type: 'constant',
      value: dataSource[view.data.value],
    };
  }

  return (
    <List>
      {(view.data.value as Array<TListViewItem>).map((item) => (
        <CustomAppListViewItem
          key={item.id}
          item={item}
          click={view.click}
        />
      ))}
    </List>
  );
};

export default CustomAppListView;
