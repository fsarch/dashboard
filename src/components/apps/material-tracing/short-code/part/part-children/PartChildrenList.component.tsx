import Link from 'next/link';
import type React from 'react';
import PartChildDeleteButton from '@/components/apps/material-tracing/short-code/part/part-children/PartChildDeleteButton.component';
import Badge from '@/components/universals/badge/badge.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import ListItemActionList from '@/components/universals/list/ListItemActionList';
import { partService } from '@/services/material-tracing/part.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type PartPartListProps = {
  partId: string;
};

const PartChildrenList: React.FunctionComponent<PartPartListProps> = async ({
  partId,
}) => {
  const parts = await partService.listPartParts(partId);

  if (!parts?.length) {
    return <div>Keine Parts verbunden.</div>;
  }

  return (
    <List>
      {parts.map(async (part) => (
        <Link href={await getServiceLocalUrl(`/part/${part.id}`)} key={part.id}>
          <ListItem
            right={
              <ListItemActionList>
                <PartChildDeleteButton partId={partId} childPartId={part.id} />
                <Badge>{part.amount}</Badge>
              </ListItemActionList>
            }
          >
            {part.name}
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default PartChildrenList;
