import React, { PropsWithChildren } from 'react';
import styles from './list.module.scss';
import clsx from "clsx";

type ListProps = PropsWithChildren<{
  className?: string;
}>;

const List: React.FunctionComponent<ListProps> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {children}
    </div>
  );
};

export default List;
