import clsx from 'clsx';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import styles from './list.module.scss';

type ListProps = PropsWithChildren<{
  className?: string;
}>;

const List: React.FunctionComponent<ListProps> = ({ children, className }) => {
  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default List;
