'use client';

import React, { CSSProperties, MouseEventHandler, PropsWithChildren, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';
import Color from "color";

type ButtonProps = PropsWithChildren<{
  name?: string;
  type: 'button' | 'submit' | 'reset';
  className?: string;
  color?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

const Button: React.FunctionComponent<ButtonProps> = ({
  name,
  type,
  children,
  className,
  onClick,
  color,
}) => {
  const style = useMemo((): CSSProperties => {
    if (!color) {
      return {};
    }

    const hoverColor = Color(color).lighten(0.3);
    const textColor = Color(color).isLight() ? '#000000' : '#FFFFFF';
    const hoverTextColor = Color(textColor).isLight() ? '#000000' : '#FFFFFF';

    return {
      '--color': color,
      '--hover-color': hoverColor,
      '--text-color': textColor,
      '--hover-text-color': hoverTextColor,
    } as CSSProperties;
  }, [color]);

  return (
    <button
      style={style}
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
