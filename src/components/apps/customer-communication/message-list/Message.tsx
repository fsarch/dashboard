import React from 'react';
import { TMessage } from "@/services/customer-communication/customer-communication.type";

import styles from './message.module.scss';
import clsx from "clsx";

type MessageProps = {
  message: TMessage;
  customerId: string | null;
};

const Message: React.FunctionComponent<MessageProps> = ({
  message,
  customerId,
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
        {message.content}
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
