import React from 'react';
import styles from './header.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SignOutIcon from "@/components/navigation/SignOutIcon";

type HeaderProps = {
  title: string;
};

const Header: React.FunctionComponent<HeaderProps> = ({
  title,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.iconWrapper}>
        <Link href="/">
          <FontAwesomeIcon icon={faHome} className={styles.icon} />
        </Link>
      </div>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.iconWrapper}>
        <SignOutIcon className={styles.iconLogout}/>
      </div>
    </div>
  );
};

export default Header;
