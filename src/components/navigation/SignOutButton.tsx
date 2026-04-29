'use client';

import React, { useCallback } from 'react';
import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';

import Button from '@/components/universals/forms/Button';

import styles from './SignOutButton.module.scss';

type SignOutButtonProps = {
  className?: string;
};

const SignOutButton: React.FunctionComponent<SignOutButtonProps> = ({
  className,
}) => {
  const handleLogoutClick = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  return (
    <Button
      type="button"
      onClick={handleLogoutClick}
      className={className}
    >
      <span className={styles.content}>
        <FontAwesomeIcon icon={faSignOut} />
        <span>Abmelden</span>
      </span>
    </Button>
  );
};

export default SignOutButton;

