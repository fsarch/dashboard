import { notFound } from 'next/navigation';
import type React from 'react';
import ItemCreateForm from '@/components/apps/product/item/create/ItemCreateForm';
import ItemTypeItemList from '@/components/apps/product/item/ItemTypeItemList';
import Section from '@/components/universals/section/Section';
import { itemService } from '@/services/product/item.service';
import type { ItemDto } from '@/services/product/item.type';
import { itemTypeService } from '@/services/product/item-type.service';

type ItemListProps = {
  catalogId: string;
  parentItemId?: string;
};

const ItemList: React.FunctionComponent<ItemListProps> = async ({
  catalogId,
  parentItemId,
}) => {
  const items = await itemService.listItems(catalogId, parentItemId ?? null);
  if (!items) {
    return notFound();
  }

  const itemsByItemType = items.reduce(
    (acc, value) => {
      acc[value.itemTypeId] ||= [];
      acc[value.itemTypeId].push(value);

      return acc;
    },
    {} as Record<string, Array<ItemDto>>,
  );

  const itemTypes = await itemTypeService.listItemTypes(catalogId);

  return (
    <>
      {itemTypes.map((itemType) => (
        <ItemTypeItemList
          key={itemType.id}
          itemType={itemType}
          catalogId={catalogId}
          items={itemsByItemType[itemType.id] ?? []}
        />
      ))}
      <Section name="Eintrag erstellen">
        <ItemCreateForm
          catalogId={catalogId}
          itemTypes={itemTypes}
          parentItemId={parentItemId}
        />
      </Section>
    </>
  );
};

export default ItemList;
