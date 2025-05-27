import React from 'react';
import { partService } from "@/services/material-tracing/part.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";

type PartPartListProps = {
  partId: string;
};

const PartChildrenList: React.FunctionComponent<PartPartListProps> = async ({
  partId,
}) => {
  const parts = await partService.listPartParts(partId);

  if (!parts?.length) {
    return (
      <div>
        Keine Parts verbunden.
      </div>
    );
  }

  return (
    <List>
      {parts.map(async (part) => (
        <Link href={await getServiceLocalUrl(`/part/${part.id}`)} key={part.id}>
          <ListItem>
            {part.name}
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default PartChildrenList;
