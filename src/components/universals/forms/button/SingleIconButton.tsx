import React from 'react';
import Button, { ButtonProps } from "@/components/universals/forms/Button";
import { TIcon } from "@/components/universals/icon/Icon.type";
import Icon from "@/components/universals/icon/Icon.component";
import clsx from "clsx";
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
    <Button
      {...props}
      className={clsx(className, styles.root)}
    >
      <Icon className={styles.icon} icon={icon}/>
    </Button>
  );
};

export default SingleIconButton;
