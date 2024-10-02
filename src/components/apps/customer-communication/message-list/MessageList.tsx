import React, { PropsWithChildren } from 'react';

import styles from './message-list.module.scss';
import clsx from "clsx";

type MessageListProps = PropsWithChildren<{
  className: string;
}>;

const MessageList: React.FunctionComponent<MessageListProps> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {children}
    </div>
  );
};

export default MessageList;
