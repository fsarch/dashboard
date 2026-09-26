import Link from 'next/link';
import type React from 'react';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Section from '@/components/universals/section/Section';
import type { ItemDto } from '@/services/product/item.type';
import type { ItemTypeDto } from '@/services/product/item-type.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type ItemTypeItemListProps = {
  itemType: ItemTypeDto;
  items: Array<ItemDto>;
  catalogId: string;
};

const ItemTypeItemList: React.FunctionComponent<ItemTypeItemListProps> = ({
  items,
  itemType,
  catalogId,
}) => {
  if (!items?.length) {
    return null;
  }

  return (
    <Section name={itemType.name}>
      <List>
        {items?.map(async (item) => (
          <Link
            key={item.id}
            href={
              await getServiceLocalUrl(`/catalog/${catalogId}/item/${item.id}`)
            }
          >
            <ListItem>{item.name}</ListItem>
          </Link>
        ))}
      </List>
    </Section>
  );
};

export default ItemTypeItemList;
