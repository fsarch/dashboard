import React from 'react';
import styles from './header.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faHexagon } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SignOutIcon from "@/components/navigation/SignOutIcon";
import HeaderIconTextItem from "@/components/navigation/HeaderIconTextItem";
import CommandCenterButton from "@/components/navigation/command-center/CommandCenterButton";

type HeaderProps = {
  title: string;
};

const Header: React.FunctionComponent<HeaderProps> = ({
  title,
}) => {
  return (
    <div className={styles.root}>
      <Link
        href="/"
        className={styles.iconWrapper}
      >
        <FontAwesomeIcon icon={faHome} className={styles.icon} />
      </Link>
      <div className={styles.visibleSpacer} />
      <CommandCenterButton/>
      <div className={styles.visibleSpacer} />
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
