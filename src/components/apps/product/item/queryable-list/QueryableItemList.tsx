import React from 'react';
import { itemService } from "@/services/product/item.service";
import { notFound } from "next/navigation";
import { itemTypeService } from "@/services/product/item-type.service";
import ItemTypeItemList from "@/components/apps/product/item/ItemTypeItemList";
import { ItemDto } from "@/services/product/item.type";
import QueryableItemListFilterSection
  from "@/components/apps/product/item/queryable-list/QueryableItemListFilterSection";

type ItemListProps = {
  catalogId: string;
  itemTypeId?: Array<string>;
  attributes?: Record<string, string>;
};

const QueryableItemList: React.FunctionComponent<ItemListProps> = async ({
  catalogId,
  itemTypeId,
  attributes,
}) => {
  const items = await itemService.listItems(catalogId, undefined, {
    itemTypeId,
    activeAttributeFilters: attributes,
  });
  if (!items) {
    return notFound();
  }

  const itemsByItemType = items.reduce((acc, value) => {
    acc[value.itemTypeId] ||= [];
    acc[value.itemTypeId].push(value);

    return acc;
  }, {} as Record<string, Array<ItemDto>>);

  const itemTypes = await itemTypeService.listItemTypes(catalogId);

  return (
    <>
      <QueryableItemListFilterSection
        catalogId={catalogId}
        itemTypes={itemTypes}
        filteredItemTypeIds={itemTypeId}
        attributes={attributes}
      />

      {itemTypes.map((itemType) => (
        <ItemTypeItemList
          key={itemType.id}
          itemType={itemType}
          catalogId={catalogId}
          items={itemsByItemType[itemType.id] ?? []}
        />
      ))}
    </>
  );
};

export default QueryableItemList;
