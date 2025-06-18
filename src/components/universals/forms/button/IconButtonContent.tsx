import React, { PropsWithChildren } from 'react';
import Icon from "@/components/universals/icon/Icon.component";
import { TIcon } from "@/components/universals/icon/Icon.type";
import styles from './IconButtonContent.module.scss';

type IconButtonContentProps = PropsWithChildren<{
  icon: TIcon;
}>;

const IconButtonContent: React.FunctionComponent<IconButtonContentProps> = ({
  children,
  icon,
}) => {
  return (
    <span className={styles.root}>
      <Icon icon={icon}/>
      {children}
    </span>
  );
};

export default IconButtonContent;
