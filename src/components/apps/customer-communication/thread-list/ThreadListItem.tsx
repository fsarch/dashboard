import React from 'react';
import { TThread } from "@/services/customer-communication/customer-communication.type";
import ListItem from "@/components/universals/list/ListItem";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

type ThreadListItemProps = {
  thread: TThread;
};

const ThreadListItem: React.FunctionComponent<ThreadListItemProps> = ({
  thread
}) => {
  return (
    <Link
      href={getServiceLocalUrl(`/threads/${thread.id}`)}
    >
      <ListItem>
        <div>
          {thread.name}
        </div>
      </ListItem>
    </Link>
  );
};

export default ThreadListItem;
