import Link from 'next/link';
import type React from 'react';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { attributeService } from '@/services/product/attribute.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type ListAttributeElementListProps = {
  catalogId: string;
  attributeId: string;
};

const ListAttributeElementList: React.FunctionComponent<
  ListAttributeElementListProps
> = async ({ catalogId, attributeId }) => {
  const elements = await attributeService.getAttributeElements(
    catalogId,
    attributeId,
  );

  return (
    <List>
      {elements.map(async (element) => (
        <Link
          href={
            await getServiceLocalUrl(
              `/catalog/${catalogId}/attributes/${attributeId}/elements/${element.id}`,
            )
          }
          key={element.id}
        >
          <ListItem>{element.name}</ListItem>
        </Link>
      ))}
    </List>
  );
};

export default ListAttributeElementList;
