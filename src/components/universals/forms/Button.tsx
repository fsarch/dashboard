'use client';

import React, { PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<{
  name?: string;
  type: 'button' | 'submit' | 'reset';
  className?: string;
}>;

const Button: React.FunctionComponent<ButtonProps> = ({
  name,
  type,
  children,
  className,
}) => {
  return (
    <button
      className={className}
      type={type}
      name={name}
    >
      {children}
    </button>
  );
};

export default Button;
