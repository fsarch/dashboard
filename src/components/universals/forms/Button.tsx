'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonProps = PropsWithChildren<{
  name?: string;
  type: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

const Button: React.FunctionComponent<ButtonProps> = ({
  name,
  type,
  children,
  className,
  onClick,
}) => {
  return (
    <button
      className={clsx(styles.root, className)}
      type={type}
      name={name}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
