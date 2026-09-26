import Link from 'next/link';
import type React from 'react';
import ListItem from '@/components/universals/list/ListItem';
import type { TThread } from '@/services/customer-communication/customer-communication.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type ThreadListItemProps = {
  thread: TThread;
};

const ThreadListItem: React.FunctionComponent<ThreadListItemProps> = async ({
  thread,
}) => {
  return (
    <Link href={await getServiceLocalUrl(`/threads/${thread.id}`)}>
      <ListItem>
        <div>{thread.name}</div>
      </ListItem>
    </Link>
  );
};

export default ThreadListItem;
