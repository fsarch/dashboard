import clsx from 'clsx';
import Color from 'color';
import type React from 'react';
import { type CSSProperties, type PropsWithChildren, useMemo } from 'react';
import styles from './badge.module.scss';

type BadgeProps = PropsWithChildren<{
  color?: string;
  className?: string;
}>;

const Badge: React.FunctionComponent<BadgeProps> = ({
  className,
  children,
  color,
}) => {
  const style = useMemo((): CSSProperties => {
    if (!color) {
      return {};
    }

    const textColor = Color(color).isLight() ? '#000000' : '#FFFFFF';

    return {
      '--color': color,
      '--text-color': textColor,
    } as CSSProperties;
  }, [color]);

  return (
    <div className={clsx(styles.root, className)} style={style}>
      {children}
    </div>
  );
};

export default Badge;
