'use client';

import React, { CSSProperties, MouseEventHandler, PropsWithChildren, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';
import Color from "color";

export type ButtonProps = PropsWithChildren<{
  name?: string;
  type: 'button' | 'submit' | 'reset';
  className?: string;
  color?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}>;

const Button: React.FunctionComponent<ButtonProps> = ({
  name,
  type,
  children,
  className,
  onClick,
  color,
  disabled,
}) => {
  const style = useMemo((): CSSProperties => {
    if (!color) {
      return {};
    }

    const hoverColor = Color(color).lighten(0.3);
    const disabledColor = Color(color).darken(0.5);
    const textColor = Color(color).isLight() ? '#000000' : '#FFFFFF';
    const hoverTextColor = Color(hoverColor).isLight() ? '#000000' : '#FFFFFF';
    const disabledTextColor = Color(disabledColor).isLight() ? '#000000' : '#FFFFFF';
    const shadowRgb = Color(color).rgb().array().join(', ');

    return {
      '--color': color,
      '--hover-color': hoverColor,
      '--text-color': textColor,
      '--hover-text-color': hoverTextColor,
      '--disabled-color': disabledColor,
      '--disabled-text-color': disabledTextColor,
      '--shadow-rgb': shadowRgb,
    } as CSSProperties;
  }, [color]);

  return (
    <button
      style={style}
      className={clsx(styles.root, className)}
      type={type}
      name={name}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
