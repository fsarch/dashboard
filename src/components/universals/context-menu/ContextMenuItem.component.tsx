import clsx from 'clsx';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import Icon from '@/components/universals/icon/Icon.component';
import type { TIcon } from '@/components/universals/icon/Icon.type';
import styles from './ContextMenuItem.module.scss';

type ContextMenuItemProps = PropsWithChildren<{
  icon?: TIcon;
  onClick: () => void;
  danger?: boolean;
}>;

const ContextMenuItem: React.FunctionComponent<ContextMenuItemProps> = ({
  icon,
  onClick,
  danger,
  children,
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.root, danger && styles.danger)}
      onClick={onClick}
    >
      {icon ? (
        <span className={styles.icon}>
          <Icon icon={icon} />
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
};

export default ContextMenuItem;
