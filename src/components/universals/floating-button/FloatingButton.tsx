import clsx from 'clsx';
import type React from 'react';
import type { CSSProperties, MouseEventHandler } from 'react';
import Icon from '@/components/universals/icon/Icon.component';
import type { TIcon } from '@/components/universals/icon/Icon.type';
import styles from './FloatingButton.module.scss';

type FloatingButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon: TIcon;
  size?: 'default' | 'small';
  className?: string;
  style?: CSSProperties;
};

const FloatingButton: React.FunctionComponent<FloatingButtonProps> = ({
  onClick,
  icon,
  size = 'default',
  className,
  style,
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.root, size === 'small' && styles.small, className)}
      style={style}
      onClick={onClick}
    >
      <Icon className={styles.icon} icon={icon} />
    </button>
  );
};

export default FloatingButton;
