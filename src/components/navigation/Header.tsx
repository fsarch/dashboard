import React from 'react';
import styles from './header.module.scss';

type HeaderProps = {
  title: string;
};

const Header: React.FunctionComponent<HeaderProps> = ({
  title,
}) => {
  return (
    <div className={styles.root}>
      {title}
    </div>
  );
};

export default Header;
