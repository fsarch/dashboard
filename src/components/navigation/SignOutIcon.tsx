'use client';

import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type React from 'react';
import { useCallback } from 'react';
import styles from './SignOutIcon.module.scss';

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
