import List from "@/components/universals/list/List";
import { customerCommunicationService } from "@/services/customer-communication/customer-communication.service";
import ThreadListItem from "@/components/apps/customer-communication/thread-list/ThreadListItem";

export default async function Home() {
  const threads = await customerCommunicationService.listThreads();

  return (
    <div>
      CCM-Overview
      <List>
        {threads.map((thread) => (
          <ThreadListItem
            key={thread.id}
            thread={thread}
          />
        ))}
      </List>
    </div>
  );
}
