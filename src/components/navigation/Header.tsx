import React from 'react';
import styles from './header.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SignOutIcon from "@/components/navigation/SignOutIcon";
import CommandCenterButton from "@/components/navigation/command-center/CommandCenterButton";
import { uacUtils } from '@/utils/uac.utils';
import DevModeSwitch from '@/components/navigation/DevModeSwitch.component';

type HeaderProps = {
  title: string;
};

const Header: React.FunctionComponent<HeaderProps> = async ({
  title,
}) => {
  const isDeveloper = await uacUtils.hasPermission('dev');

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
      {isDeveloper && (
        <div className={styles.iconWrapper}>
          <DevModeSwitch />
        </div>
      )}
      <div className={styles.iconWrapper}>
        <SignOutIcon className={styles.iconLogout}/>
      </div>
    </div>
  );
};

export default Header;
