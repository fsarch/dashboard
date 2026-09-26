import clsx from 'clsx';
import type React from 'react';
import Button, { type ButtonProps } from '@/components/universals/forms/Button';
import Icon from '@/components/universals/icon/Icon.component';
import type { TIcon } from '@/components/universals/icon/Icon.type';
import styles from './SingleIconButton.module.scss';

export type SingleIconButtonProps = ButtonProps & {
  icon: TIcon;
};

const SingleIconButton: React.FunctionComponent<SingleIconButtonProps> = ({
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <Button {...props} className={clsx(className, styles.root)}>
      <Icon className={styles.icon} icon={icon} />
    </Button>
  );
};

export default SingleIconButton;
