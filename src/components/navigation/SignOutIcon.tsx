'use client';

import React, { useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import clsx from "clsx";
import styles from './SignOutIcon.module.scss';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type SignOutIconProps = {
  className: string;
};

const SignOutIcon: React.FunctionComponent<SignOutIconProps> = ({
  className,
}) => {
  const router = useRouter();

  const handleLogoutClick = useCallback(async () => {
    await signOut();

    router.push('/');
  }, []);

  return (
    <FontAwesomeIcon
      icon={faSignOut}
      className={clsx(styles.root, className)}
      onClick={handleLogoutClick}
    />
  );
};

export default SignOutIcon;
