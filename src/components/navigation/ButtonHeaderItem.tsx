import React, { MouseEventHandler, PropsWithChildren } from 'react';
import styles from './ButtonHeaderItem.module.scss';

type ButtonHeaderItemProps = PropsWithChildren<{
  onClick: MouseEventHandler<HTMLButtonElement>;
}>;

const ButtonHeaderItem: React.FunctionComponent<ButtonHeaderItemProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.root}
    >
      {children}
    </button>
  );
};

export default ButtonHeaderItem;
