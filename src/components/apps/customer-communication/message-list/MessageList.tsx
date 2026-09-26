import clsx from 'clsx';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import styles from './message-list.module.scss';

type MessageListProps = PropsWithChildren<{
  className: string;
}>;

const MessageList: React.FunctionComponent<MessageListProps> = ({
  children,
  className,
}) => {
  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default MessageList;
