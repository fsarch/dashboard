import React from 'react';
import { TMessage } from "@/services/customer-communication/customer-communication.type";

import styles from './message.module.scss';
import clsx from "clsx";
import Content from "@/components/apps/customer-communication/message-list/message/content/content.component";

type MessageProps = {
  message: TMessage;
  customerId: string | null;
  threadId: string;
};

const Message: React.FunctionComponent<MessageProps> = ({
  message,
  customerId,
  threadId,
}) => {
  const messageCustomerId = message.customer?.id ?? null;

  return (
    <div
      className={clsx(styles.root, {
        [styles.sameUser]: customerId === messageCustomerId,
        [styles.otherUser]: customerId !== messageCustomerId,
      })}
    >
      <div className={styles.content}>
        <Content
          content={message.content}
          contentType={message.contentType.id}
          threadId={threadId}
          messageId={message.id}
        />
      </div>
      <div className={styles.subline}>
        {new Date(message.creationTime).toLocaleString('de-de', {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })}
      </div>
    </div>
  );
};

export default Message;
