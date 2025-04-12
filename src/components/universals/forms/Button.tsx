'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';

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
      className={className}
      type={type}
      name={name}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
