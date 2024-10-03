import { customerCommunicationService } from "@/services/customer-communication/customer-communication.service";
import Message from "@/components/apps/customer-communication/message-list/Message";
import MessageList from "@/components/apps/customer-communication/message-list/MessageList";

import styles from './page.module.css';
import TextArea from "@/components/universals/forms/TextArea";
import MessageFooter from "@/components/apps/customer-communication/message-list/MessageFooter";
import { threadId } from "node:worker_threads";

export default async function Home({ params }: { params: { threadId: string } }) {
  const threadMessages = await customerCommunicationService.listThreadMessages(params.threadId);

  return (
    <div className={styles.root}>
      CCM-Overview
      <MessageList className={styles.messages}>
        {threadMessages.map((message) => (
          <Message
            key={message.id}
            message={message}
            customerId={null}
            threadId={params.threadId}
          />
        ))}
      </MessageList>
      <div className={styles.answerBar}>
        <MessageFooter
          threadId={params.threadId}
        />
      </div>
    </div>
  );
}
