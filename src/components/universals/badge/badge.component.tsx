import React, { PropsWithChildren } from 'react';
import styles from './badge.module.scss';

type BadgeProps = PropsWithChildren<{

}>;

const Badge: React.FunctionComponent<BadgeProps> = ({
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default Badge;
